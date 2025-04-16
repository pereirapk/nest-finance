import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletDto } from '../dto/wallet.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import {  Types } from 'mongoose';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { CreateOrUpdateStockOnWallet } from '../use-cases/CreateOrUpdateStockOnWallet';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
@Controller('wallet')
export class WalletController {

  constructor(
    private readonly createOrUpdateWallet: CreateOrUpdateStockOnWallet,
    private readonly walletService: WalletRepository
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
  async findByUserId(@Query('userId') userId: Types.ObjectId): Promise<any> {
    return this.walletService.getByUser(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Query('id') id: Types.ObjectId): Promise<any> {
    const walletId = new Types.ObjectId();
    return this.walletService.deleteStockfromWallet(id,walletId);
  }

}
