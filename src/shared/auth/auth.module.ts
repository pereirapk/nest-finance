import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UserModule } from '../../user/user.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn:process.env.EXPIRES_IN,
          algorithm: 'HS256'
        },
        global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
