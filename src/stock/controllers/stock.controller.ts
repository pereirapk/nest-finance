import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StockService } from '../service/stock.service';
import { StockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('find')
  async getStockPrice(@Query('symbol') symbol: string): Promise<any> {
    return this.stockService.getStockPrice(symbol);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Body() stockDto: StockDto): Promise<any> {
    return this.stockService.create(stockDto);
  }
}
