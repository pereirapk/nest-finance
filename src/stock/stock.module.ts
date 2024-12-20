import { Module } from '@nestjs/common';
import { StockService } from './service/stock.service';
import { StockController } from './controllers/stock.controller';

@Module({
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}