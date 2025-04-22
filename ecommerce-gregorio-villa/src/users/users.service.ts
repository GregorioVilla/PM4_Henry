import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user-entity';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsersService(page: number, limit: number) {
    let users = await this.userRepository.find();

    const start = (page - 1 ) * limit;
    const end = start + limit;

    users = users.slice(start, end)

    return users.map(({password, ...user}) => user);
  }


  async getUserByIdService (id: string){
    const user = await this.userRepository.findOne({
      where: {id},
    });
    if (!user){
      return 'User not found';
    }
    const {password, ...userWithoutPassword} = user;

    return userWithoutPassword;
  }

  async updateUserService(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUserService(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

}
