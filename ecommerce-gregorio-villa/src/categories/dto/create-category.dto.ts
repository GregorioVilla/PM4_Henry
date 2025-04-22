import { IsNotEmpty, IsUUID, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  
    @IsNotEmpty()
    @IsString()
    name: string;
  }