import { Injectable, NotFoundException } from '@nestjs/common';
import { FileuploadRepository } from './fileupload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileuploadService {
  constructor(
    @InjectRepository(Producto)
    private readonly productsRepository: Repository<Producto>,
    private readonly fileuploadRepository: FileuploadRepository,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

   
    const uploadResult = await this.fileuploadRepository.uploadImage(file);

   
    const imageUrl = uploadResult.secure_url;

   
    product.imgUrl = imageUrl; 
    
   
    await this.productsRepository.save(product);

    return {
      message: 'Image uploaded and product updated successfully',
      imageUrl: imageUrl,
    };
  }
}
