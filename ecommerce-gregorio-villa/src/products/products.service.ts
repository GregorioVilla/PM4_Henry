import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/product.entity';
import CreateProductDto from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as data from '../DATA.json';
import { Categories } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Categories) private readonly categoriesRepository: Repository<Categories>
  ) {}

  async create(data: any[]) {
    const categories = await this.categoriesRepository.find();  // Obtener todas las categorías
  
    for (const element of data) {
      // Buscar la categoría por nombre
      const category = categories.find(cat => cat.name === element.category);
  
      // Si la categoría existe, crear el producto
      if (category) {
        const product = this.productRepository.create({
          name: element.name,
          description: element.description,
          price: element.price,
          stock: element.stock,
          imgUrl: element.imgUrl,
          category: category,  // Asociar la categoría
        });
  
        // Guardar el producto en la base de datos
        await this.productRepository.save(product);
      } else {
        // Si la categoría no se encuentra, lanzar una excepción
        throw new NotFoundException(`Category ${element.category} not found`);
      }
    }
    return { message: 'Products created successfully' };
  }
  
  
  async addProducts() {
    for (const element of data) {
      const category = await this.categoriesRepository.findOne({
        where: { name: element.category },
      });
  
      if (!category) {
        console.log(`Categoría ${element.category} no encontrada para el producto ${element.name}`);
        continue;
      }
  
      const product = this.productRepository.create({
        name: element.name,
        description: element.description,
        price: element.price,
        stock: element.stock,
        imgUrl: element.imgUrl,
        category: category,
      });
  
      console.log(`Producto creado: ${product.name}, Categoría: ${category.name}`); // Verifica la categoría asociada
      await this.productRepository.save(product);
    }
  }
  
  
  
  async getProducts(page: number, limit: number): Promise<CreateProductDto[]> {
    const products = await this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
    });
  
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      category: product.category, // Asegúrate de que se devuelva la categoría si existe
    }));
  }
  

  async findOne(id: string): Promise<CreateProductDto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Producto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!updatedProduct) {
      throw new NotFoundException(
        `Producto con id ${id} no encontrado después de la actualización`,
      );
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
  }
}
