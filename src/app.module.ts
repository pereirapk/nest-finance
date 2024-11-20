import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      StockModule,
      AuthModule,
      WalletModule
    ],    
})
export class AppModule {}
