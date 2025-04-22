import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Producto } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user-entity';
import { Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Producto)
    private readonly productsRepository: Repository<Producto>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async create(userId: string, productIds: string[]) {
    let total = 0;
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;
    const newOrder = await this.ordersRepository.save(order);

    
    const productsArray = await Promise.all(
        productIds.map(async (productId) => {
            const product = await this.productsRepository.findOneBy({
                id: productId,
            });
            if (!product) {
                throw new NotFoundException(`Product with id ${productId} not found`);
            }

            if (product.stock === undefined || product.stock <= 0) {
                throw new NotFoundException(`Product with id ${productId} has insufficient stock`);
            }

            total += Number(product.price);
            await this.productsRepository.update(
                { id: product.id },
                { stock: product.stock - 1 },
            );

            return product;
        }),
    );

    
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(Number(total).toFixed(2)); 
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;
    await this.orderDetailsRepository.save(orderDetail);

    
    const orderWithDetails = await this.ordersRepository.findOne({
        where: { id: newOrder.id },
        relations: {
            orderDetails: {
                products: true,
            },
        },
    });

    return {
        ...orderWithDetails,
        totalPrice: total, 
    };
}

async findAll(): Promise<Orders[]> {
  return await this.ordersRepository.find();
}

  findOne(id: string) {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
    if (!order) {
      return 'Order not found';
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const updatedOrder = {
      ...order,
      ...updateOrderDto,
      date: updateOrderDto.date ? new Date(updateOrderDto.date) : order.date,
    };

    if (updateOrderDto.orderDetails) {
      const orderDetails = await this.orderDetailsRepository.findOne({
        where: { order: { id } },
      });
      
      if (orderDetails) {
        await this.orderDetailsRepository.update(
          { id: orderDetails.id },
          { 
            price: updateOrderDto.orderDetails.price || orderDetails.price,
          }
        );
      }
    }

    await this.ordersRepository.save(updatedOrder);
    
    return this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
  }

  async remove(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (order.orderDetails) {
      await this.orderDetailsRepository.delete({
        order: { id },
      });
    }

    await this.ordersRepository.delete(id);

    return {
      message: `Order #${id} has been successfully removed`,
    };
  }

}
