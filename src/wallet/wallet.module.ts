import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';
import { CreateOrUpdateStockOnWallet } from './use-cases/CreateOrUpdateStockOnWallet';
import { MongoModule } from 'src/shared/infrastruture/mongo/mongo.module';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  imports: [MongoModule, StockModule],
  controllers: [WalletController],
  exports: [WalletRepository],
  providers: [CreateOrUpdateStockOnWallet, WalletRepository],
})
export class WalletModule {}
