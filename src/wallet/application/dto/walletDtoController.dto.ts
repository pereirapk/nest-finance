import { IsNotEmpty, IsInt, Min, Max, IsString } from 'class-validator';
import { IsObjectId } from '../../../shared/common/decorators/is-object-id.decorator';


export class WalletDtoController {    
    @IsString()
    @IsNotEmpty({ message: 'O campo de nome não pode estar vazio' })
    symbol: string;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty({ message: 'O campo de quantidade não pode estar vazio' })
    @IsInt({ message: 'O campo deve ser um número inteiro'})
    @Min(1, { message: 'O campo deve ser maior que 1' })
    @Max(20, { message: 'O campo deve ser menor que 10' })
    note: number;
}
