import { Module } from '@nestjs/common';
import { WalletService } from './domain/services/wallet.service';
import { WalletController } from './infrastruture/controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';
import { CreateOrUpdateStockOnWallet } from './application/use-cases/CreateOrUpdateStockOnWallet';
import { MongoModule } from 'src/shared/infrastruture/mongo/mongo.module';
import { WalletRepository } from './domain/repositories/wallet.repository';
import { MongoService } from 'src/shared/infrastruture/mongo/mongo.service';

@Module({
  imports: [MongoModule, StockModule],
  controllers: [WalletController],
  exports: [WalletService],
  providers: [WalletService, CreateOrUpdateStockOnWallet, WalletRepository],
})
export class WalletModule {}
