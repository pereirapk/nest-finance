import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StockService } from '../../domain/service/stock.service';
import { StockDto } from '../../application/dto/stock.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';



@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('find')
  async getStockPrice(@Query('symbol') symbol: string): Promise<any> {
    return this.stockService.getStockPrice(symbol);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async save(@Body() stockDto: StockDto): Promise<any> {
    return this.stockService.save(stockDto);
  }
}
