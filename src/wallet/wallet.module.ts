import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';
import { SaveStockOnWalletUseCase } from './use-cases/saveStockOnWallet.use-case';
import { MongoModule } from 'src/shared/infrastruture/mongo/mongo.module';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  imports: [MongoModule, StockModule],
  controllers: [WalletController],
  exports: [WalletRepository],
  providers: [SaveStockOnWalletUseCase , WalletRepository],
})
export class WalletModule {}
