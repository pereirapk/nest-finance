import { Module } from '@nestjs/common';
import { StockRepository } from './repositories/stock.repository';
import { StockController } from './controllers/stock.controller';
import { SaveStockUseCase } from './use-cases/saveStock.use-case';

@Module({
  providers: [SaveStockUseCase, StockRepository],
  controllers: [StockController],
  exports: [StockRepository],
})
export class StockModule {}