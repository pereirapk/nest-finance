import { CreateUserDto } from './../../users/dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { WalletDtoController } from '../dto/walletDtoController.dto';
import { WalletDto } from '../dto/wallet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongodb';
import { CurrentUser } from 'src/users/decorator/currentUser.decorator';
import { StockService } from 'src/stock/service/stock.service';
import { query } from 'express';
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
      const userStocks = walletUser?.stock ?? [];
      if (userStocks.some((a) => a.id === stockInput.id)) {
      console.log("Estou atualizando um item")
      console.log({stockInput})

        newStocks = walletUser.stock.reduce(
          (acc: WalletDto['stock'], stock) => {
            if (stock.id === stockInput.id) {
              acc.push({
                stockId: stockInput.id,
                quantity: stockInput.quantity + walletDtoController.quantity,
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
        //tenho que adicionar
        console.log("Estou adicionando um item novo")

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
}
