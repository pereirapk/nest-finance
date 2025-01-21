import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  // Password
  import { AuthGuard } from '@nestjs/passport';
  // Decorators
  import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
  // Error Handling
  import { UnauthorizedError } from '../errors/unauthorized.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Aguarda a resolução do método base
    const isAuthorized = await super.canActivate(context);
    console.log(isAuthorized)
    if (!isAuthorized) {
      throw new UnauthorizedException('Token is invalid or missing');
    }

    // Adicione validações adicionais aqui (opcional)
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('User is not active');
    }

    return true; // Permite o acesso à rota protegida
  }
}