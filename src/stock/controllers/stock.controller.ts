import { Types } from 'mongoose';
import { SaveStockUseCase } from './../use-cases/saveStock.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { StockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { DeleteStockUseCase } from '../use-cases/deleteStock.use-case';

@Controller('stock')
export class StockController {
  constructor(
    private readonly deleteStock: DeleteStockUseCase,
    private readonly saveStockUseCase: SaveStockUseCase,
    private readonly stockRepository: StockRepository,
  ) {}

  @Get('get-price')
  async getStockPrice(@Query('symbol') symbol: string): Promise<any> {
    return this.stockRepository.getStockPrice(symbol);
  }
  @Get('find-by-symbol')
  async searchBySymbol(@Query('symbol') symbol: string): Promise<any> {
    return this.stockRepository.searchBySymbol(symbol);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async save(@Body() stockDto: StockDto): Promise<any> {
    return this.saveStockUseCase.execute(stockDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':symbol')
  async delete(@Query('symbol') symbol: string): Promise<any> {
    return this.deleteStock.execute(symbol);
  }
}
