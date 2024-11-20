import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from '../../common/decorators/is-object-id.decorator';


export class WalletDto {    
    @IsNotEmpty()
    @IsObjectId()
    id_user: number;

    @IsNotEmpty()
    @IsObjectId()
    id_stock: number;

    @IsNotEmpty()
    quantity: number;
}
