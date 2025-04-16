import { UserRepository } from '../../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (user && (await bcrypt.compare(payload.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(loginUserDto: LoginDto) {
    const user = await this.userRepository.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      ...token,
    };
  }
  private _createToken(user: any): any {
  const Authorization = this.jwtService.sign(
    user,
    {
      secret: process.env.JWT_SECRET,
      expiresIn:process.env.EXPIRES_IN
    });
    return {
      expiresIn: process.env.EXPIRESIN,
      Authorization,
    };
  }
}
