import { UserRepository } from '../repositories/user.repository';
import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuario criado com sucesso',
      data: {
        name: user.name,
        email: user.email,
      },
    };
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.userRepository.findByEmail(email);
  }
}
