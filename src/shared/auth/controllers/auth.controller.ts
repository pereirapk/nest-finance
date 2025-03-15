import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../../user/application/dto/create-user.dto';
import { UsersService } from '../../../user/domain/services/users.service';
import { IsPublic } from '../decorators/is-public.decorator';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @IsPublic()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }
}
