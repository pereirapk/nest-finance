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
import { ObjectId, Types } from 'mongoose';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { CreateOrUpdateStockOnWallet } from '../../application/use-cases/CreateOrUpdateStockOnWallet';

@Controller('wallet')
export class WalletController {

  constructor(
    private readonly walletService: WalletService,
    private readonly createOrUpdateWallet: CreateOrUpdateStockOnWallet
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
  async delete(@Query('id') id: ObjectId): Promise<any> {
    const walletId = new Types.ObjectId();
    return this.walletService.deleteStockfromWallet(id,walletId);
  }

}
