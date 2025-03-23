
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from '../../domain/services/wallet.service';
import { WalletDto } from '../../application/dto/wallet.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongodb';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { StockService } from 'src/stock/domain/services/stock.service';
import { Wallet } from '../../domain/entities/wallet.entity'
import { CreateOrUpdateStockOnWallet } from '../../application/use-cases/CreateOrUpdateStockOnWallet';

@Controller('wallet')
export class WalletController {

  private stock: any;
  private walletEntity: Wallet;

  constructor(
    private readonly walletService: WalletService,
    private readonly createOrUpdateWallet: CreateOrUpdateStockOnWallet,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(
    @Body() walleDto: WalletDto,
    @CurrentUser() user,
  ): Promise<any> {
    this.createOrUpdateWallet.execute(walleDto, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async findByUserId(@Query('userId') userId: ObjectId): Promise<any> {
    return this.walletService.getByUser(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Query('id') id: ObjectId): Promise<any> {
    const walletId = new ObjectId();
    return this.walletService.deleteStockfromWallet(id,walletId);
  }

}
