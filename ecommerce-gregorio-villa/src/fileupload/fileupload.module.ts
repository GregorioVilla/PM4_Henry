import { Module } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileuploadController } from './fileupload.controller';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileuploadRepository } from './fileupload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [FileuploadController],
  providers: [FileuploadService, CloudinaryConfig, FileuploadRepository ],
})
export class FileuploadModule {}
