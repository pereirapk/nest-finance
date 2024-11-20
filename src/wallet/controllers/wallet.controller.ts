import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { WalletDto } from '../dto/wallet.dto';
import { ObjectId } from 'mongodb';



@Controller('wallet')
export class StockController {
  constructor(private readonly walletService: WalletService) {}

  @Post('save')
  async create(@Body() walletDto: WalletDto): Promise<any> {
    return this.walletService.create(walletDto);
  }
 
  @Get('getAll')
  async findByUserId(@Query('userId') userId: ObjectId): Promise<any> {
    return this.walletService.findByUser(userId);
  }      
}
