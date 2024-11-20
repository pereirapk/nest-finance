import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo de email de usuário não pode estar vazio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo de senha não pode estar vazio' })
  password: string;
}
