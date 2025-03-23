import { Module } from '@nestjs/common';
import { StockService } from './domain/services/stock.service';
import { StockController } from './infracstruture/controllers/stock.controller';

@Module({
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}