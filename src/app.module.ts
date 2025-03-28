import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './shared/auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { JwtStrategy } from './shared/auth/strategies/jwt.strategy';
import { MongoModule } from './shared/infrastruture/mongo/mongo.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      StockModule,
      AuthModule,
      WalletModule,
      MongoModule,
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      JwtStrategy
    ]
})
export class AppModule {}
