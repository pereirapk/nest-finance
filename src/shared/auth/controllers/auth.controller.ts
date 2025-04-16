import { UserRepository } from '../../../user/repositories/user.repository';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { IsPublic } from '../decorators/is-public.decorator';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}
  @IsPublic()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }
}
