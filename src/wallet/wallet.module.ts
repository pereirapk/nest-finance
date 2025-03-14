import { Module } from '@nestjs/common';
import { WalletService } from './service/wallet.service';
import { DatabaseModule } from 'src/database/database.module';
import { WalletController } from './controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [DatabaseModule, StockModule], 
  controllers: [WalletController],               
  exports: [WalletService],   
  providers: [WalletService]
})
export class WalletModule {}
