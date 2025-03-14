
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { WalletDtoController } from '../dto/walletDtoController.dto';
import { WalletDto } from '../dto/wallet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongodb';
import { CurrentUser } from 'src/users/decorator/currentUser.decorator';
import { StockService } from 'src/stock/service/stock.service';
@Controller('wallet')
export class WalletController {
  private stock: any;
  private walletDto: WalletDto;

  constructor(
    private readonly walletService: WalletService,
    private readonly stockService: StockService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(
    @Body() walletDtoController: WalletDtoController,
    @CurrentUser() user,
  ): Promise<any> {
    this.walletDto = new WalletDto();
    if (user) {
      this.walletDto.userId = user.id;
    }
    if (walletDtoController.symbol) {
      const stockInput = await this.stockService.getStock({
        symbol: walletDtoController.symbol,
      });
      const walletUser = await this.walletService.getByUser(user.id);
      let newStocks = [];
      const userStocks = walletUser?.stocks ?? [];
      if (userStocks.some((a) => a.stockId.equals(stockInput.id))) {

        newStocks = userStocks.reduce(
          (acc: WalletDto['stock'], stock) => {
            if (stock.stockId.equals(stockInput.id)) {
              acc.push({
                stockId: stockInput.id,
                quantity: (Number.isNaN(stock.quantity)? 0 : stock.quantity) + (walletDtoController?.quantity ?? 0),
                note: walletDtoController.note,
              });
            } else {
              acc.push(stock);
            }
            return acc;
          },
          [],
        );
      } else {
        newStocks = [
          ...(walletUser?.stock || []),
          {
            stockId: stockInput?.id,
            quantity: (stockInput?.quantity ?? 0) + walletDtoController?.quantity,
            note: walletDtoController.note,
          },
        ];
      }
      return this.walletService.updateOne({
        query: {
          userId : user.id,
        },
        update: {
          stock: newStocks,
        },
      });
    }
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
