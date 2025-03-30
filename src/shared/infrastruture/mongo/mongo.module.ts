//NAO VAI USAR

import { Module, Global } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/domain/entities/user.schema';
import { Stock, StockSchema } from 'src/stock/domain/entities/stock.schema';
import { Wallet, WalletSchema } from 'src/wallet/domain/entities/wallet.schema';
@Global()
@Module({
  imports: [ MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Stock.name, schema: StockSchema },
    { name: Wallet.name, schema: WalletSchema },
  ]),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
