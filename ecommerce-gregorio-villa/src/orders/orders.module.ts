import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { Orders } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user-entity';
import { Producto } from 'src/products/entities/product.entity';
import { OrderDetails } from './entities/orderDetails';



@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, OrderDetails,User,Producto]),  
    UsersModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
