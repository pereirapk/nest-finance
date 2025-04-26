import { Module } from '@nestjs/common';
import { StockRepository } from './repositories/stock.repository';
import { StockController } from './controllers/stock.controller';

@Module({
  providers: [StockRepository],
  controllers: [StockController],
  exports: [StockRepository],
})
export class StockModule {}