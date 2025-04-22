import { IsNotEmpty, IsUUID, IsString, IsNumber, IsUrl } from 'class-validator';

class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  imgUrl: string;

}

export default CreateProductDto;
