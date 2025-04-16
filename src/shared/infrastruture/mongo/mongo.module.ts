//NAO VAI USAR

import { Module, Global } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { Stock, StockSchema } from 'src/stock/entities/stock.schema';
import { Wallet, WalletSchema } from 'src/wallet/entities/wallet.schema';
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
