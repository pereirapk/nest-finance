import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
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
    return this.usersService.findByEmail(email);
  }
}
