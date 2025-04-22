import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import  CreateProductDto  from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';  
import { Producto } from './entities/product.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Post()
  async create(@Body() data: any): Promise<any> {
    // Si data es un solo objeto, no un array
    return this.productsService.create([data]);  // Lo envolvemos en un array
  }
  @Get('seeder')
  addCategories() {
    return this.productsService.addProducts();
  }
  @Get()
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit?: string, 
  ): Promise<CreateProductDto[]> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : 5; 

 
    if (limitNum <= 0) {
      throw new HttpException('Limit must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.getProducts(pageNum, limitNum);
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateProductDto | undefined> {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @Put(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Producto> { 
    return this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
