import { Module } from '@nestjs/common';
import { WalletService } from './domain/services/wallet.service';
import { DatabaseModule } from 'src/shared/infrastruture/database/database.module';
import { WalletController } from './infrastruture/controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [DatabaseModule, StockModule], 
  controllers: [WalletController],               
  exports: [WalletService],   
  providers: [WalletService]
})
export class WalletModule {}
