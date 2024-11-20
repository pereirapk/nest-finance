import { IsString, IsNotEmpty, Length, IsInt, Min, Max } from 'class-validator';

export class StockDto {

  @IsString()
  @IsNotEmpty({ message: 'O campo de nome não pode estar vazio' })
  symbol: string;

  @IsNotEmpty({ message: 'O campo de preço não pode estar vazio' })
  price: number;

  @IsNotEmpty({ message: 'O campo de tipo não pode estar vazio' })
  @Length(1, 5, { message: 'O campo pode ter no máximo 5 caracteres' })
  type: string;

  @IsNotEmpty({ message: 'O campo de quantidade não pode estar vazio' })
  @IsInt({ message: 'O campo deve ser um número inteiro'})
  @Min(1, { message: 'O campo deve ser maior que 1' })
  @Max(10, { message: 'O campo deve ser menor que 10' })
  note: number;

}

