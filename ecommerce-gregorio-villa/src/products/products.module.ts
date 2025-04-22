import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Producto } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto]),
            TypeOrmModule.forFeature([Categories])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
