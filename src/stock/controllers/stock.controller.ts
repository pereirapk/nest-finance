import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StockService } from '../service/stock.service';
import { StockDto } from '../dto/stock.dto';



@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('find')
  async getStockPrice(@Query('symbol') symbol: string): Promise<any> {
    return this.stockService.getStockPrice(symbol);
  }
  @Post('save')
  async create(@Body() stockDto: StockDto): Promise<any> {
    return this.stockService.create(stockDto);
  }
}
