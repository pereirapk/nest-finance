import { Module } from '@nestjs/common';
import { WalletService } from './domain/services/wallet.service';
import { WalletController } from './infrastruture/controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';
import { CreateOrUpdateStockOnWallet } from './application/use-cases/CreateOrUpdateStockOnWallet';
import { DatabaseModule } from 'src/shared/infrastruture/database/database.module';

@Module({
  imports: [DatabaseModule, StockModule],
  controllers: [WalletController],
  exports: [WalletService],
  providers: [WalletService, CreateOrUpdateStockOnWallet],
})
export class WalletModule {}
