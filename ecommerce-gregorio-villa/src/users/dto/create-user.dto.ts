import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsNumber,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/helpers/passwordMatcher';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  email: string;

  
@IsString()
  birthdate: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @Validate(MatchPassword, ['password'])
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(80)
  address: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  city: string;
}

export class loginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(80)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;
}
