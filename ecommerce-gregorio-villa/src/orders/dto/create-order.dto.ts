import { IsNotEmpty, IsUUID, IsArray, ArrayMinSize } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  products: string[]
}
