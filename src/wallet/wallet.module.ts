import { WalletRepositoryInterface } from './domain/repositories/interfaces/walletRepository.interface';
import { Module } from '@nestjs/common';
import { WalletService } from './domain/services/wallet.service';
import { DatabaseModule } from 'src/shared/infrastruture/database/database.module';
import { WalletController } from './infrastruture/controllers/wallet.controller';
import { StockModule } from 'src/stock/stock.module';
import { CreateOrUpdateStockOnWallet } from './application/use-cases/CreateOrUpdateStockOnWallet';
import { WalletRepository } from './domain/repositories/wallet.repository';

@Module({
  imports: [DatabaseModule, StockModule], 
  controllers: [WalletController],               
  exports: [WalletService],   
  providers: [WalletService, CreateOrUpdateStockOnWallet, [
    {
      provide: WalletRepositoryInterface,
      useClass: WalletRepository,
    }
  ]]
})
export class WalletModule {}
