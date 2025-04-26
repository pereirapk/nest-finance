import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { StockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';



@Controller('stock')
export class StockController {
  constructor(private readonly stockRepository: StockRepository) {}

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
    return this.stockRepository.save(stockDto);
  }
}
