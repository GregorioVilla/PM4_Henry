import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, loginUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user-entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async addUserService(user: CreateUserDto): Promise<Partial<User>> {
    const {
      email, 
      password,
      passwordConfirmation,
      ...userWithoutConfirmation

    } = user;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const NewBirthdate = new Date (user.birthdate)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      ...userWithoutConfirmation,
      email,
      password: hashedPassword,
      birthdate: NewBirthdate
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  async signIn(credentials: loginUserDto) {
    const { email, password } = credentials;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser) throw new BadRequestException('Invalid Credentials');

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) throw new BadRequestException('Invalid Credentials');

    const userPayload = {
      id: existingUser,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    };
    const token = this.jwtService.sign(userPayload);

    return {
      token,
      message: 'Success',
    };
  }
}
