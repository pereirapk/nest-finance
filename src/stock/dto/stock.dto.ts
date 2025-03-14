import { IsString, IsNotEmpty, Length } from 'class-validator';

export class StockDto {

  @IsString()
  @IsNotEmpty({ message: 'O campo de nome não pode estar vazio' })
  symbol: string;

  @IsNotEmpty({ message: 'O campo de preço não pode estar vazio' })
  price: number;

  @IsNotEmpty({ message: 'O campo de tipo não pode estar vazio' })
  @Length(1, 5, { message: 'O campo pode ter no máximo 5 caracteres' })
  type: string;
}

