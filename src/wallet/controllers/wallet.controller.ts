import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletDto } from '../dto/wallet.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { SaveStockOnWalletUseCase } from '../use-cases/saveStockOnWallet.use-case';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly saveStockOnWalletUseCase: SaveStockOnWalletUseCase,
    private readonly walletService: WalletRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async save(@Body() walleDto: WalletDto, @CurrentUser() user): Promise<any> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!walleDto.symbol) {
      throw new HttpException('Symbol is required', HttpStatus.BAD_REQUEST);
    }
    return await this.saveStockOnWalletUseCase.execute(walleDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async findByUserId(@CurrentUser() user): Promise<any> {
    return await this.walletService.getByUser(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Query('id') id: Types.ObjectId): Promise<any> {
    const walletId = new Types.ObjectId();
    return this.walletService.deleteStockfromWallet(id, walletId);
  }
}
