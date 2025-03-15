import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { IsObjectId } from '../../../shared/common/decorators/is-object-id.decorator';
import { ObjectId } from 'mongodb';


export class WalletDto {    
    @IsNotEmpty()
    @IsObjectId()
    userId: ObjectId;


    stock: {
        stockId: ObjectId,
        quantity: number,
        note: number
    }[]

    @IsNotEmpty()
    @IsObjectId()
    stockId: ObjectId;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty({ message: 'O campo de quantidade não pode estar vazio' })
    @IsInt({ message: 'O campo deve ser um número inteiro'})
    @Min(1, { message: 'O campo deve ser maior que 1' })
    @Max(10, { message: 'O campo deve ser menor que 10' })
    note: number;
}
