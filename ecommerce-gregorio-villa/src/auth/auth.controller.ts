import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, loginUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singUp(@Body()user: CreateUserDto){
    return this.authService.addUserService(user)
  }
  @Post('/signin')
  singIn(@Body()credentials: loginUserDto){
    return this.authService.signIn(credentials)
  }

}
