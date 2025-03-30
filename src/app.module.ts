import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './shared/auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { JwtStrategy } from './shared/auth/strategies/jwt.strategy';
import { MongoModule } from './shared/infrastruture/mongo/mongo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/domain/entities/user.schema';
import { Stock, StockSchema } from './stock/domain/entities/stock.schema';
import { Wallet, WalletSchema } from './wallet/domain/entities/wallet.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
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
