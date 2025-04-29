import { WalletDto } from '../dto/wallet.dto';
import { StockRepository } from '../../stock/repositories/stock.repository';
import { ObjectId, Types } from 'mongoose';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { WalletDocument } from 'src/wallet/entities/wallet.schema';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
@Injectable()
export class SaveStockOnWalletUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly walletRepository: WalletRepository,
  ) {}
  async execute(WalletDto: WalletDto, userId: Types.ObjectId) {
    let stockInput = await this.stockRepository.getStock({
      symbol: WalletDto.symbol,
    });
    if (stockInput === null) {
      stockInput = this.saveStock(WalletDto.symbol);
    }
    const walletUser = await this.walletRepository.getByUser(userId);
    let newStock = [];
    const userStock = walletUser.stock;
    if (userStock.some((stock) => stock.stockId.equals(stockInput.id))) {
      // if has stock in wallet
      newStock = userStock.reduce((acc: WalletDocument['stock'], stock) => {
        if (stock.stockId.equals(stockInput.id)) {
          acc.push({
            stockId: stockInput.id,
            quantity:
              (Number.isNaN(stock.quantity) ? 0 : stock.quantity) +
              (WalletDto?.quantity ?? 0),
            note: Number.isNaN(stock.quantity) ? WalletDto.note : stock.note,
          });
        } else {
          acc.push(stock);
        }
        return acc;
      }, []);
    } else {
      // if  hasn't stock in wallet
      console.log("nao tem essa acao na carteira")
      newStock = [
        {
          stockId: stockInput?.id,
          quantity: WalletDto?.quantity,
          note: WalletDto.note,
        },
      ];
    }
    console.log(newStock)
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Stock update with success',
      data: {
        wallet: await this.walletRepository.save({
          query: walletUser,
          update: { userId: walletUser.userId, stock: newStock },
        }),
      },
    };
  }
  private async saveStock(symbol: string) {
    let stockPrice = await this.stockRepository.getStockPrice(
      symbol,
    );
    if (stockPrice.symbol === null || stockPrice.symbol === undefined) {
      throw new NotFoundException('Stock not found');
    }
    if (
      stockPrice.symbol.lenght > 3 &&
      Number(stockPrice.symbol.substring(4, 5) >= 3)
    ) {
      stockPrice = { ...stockPrice, type: 'Acao' };
    } else {
      stockPrice = { ...stockPrice, type: 'ETF' };
    }

    return await this.stockRepository.save(stockPrice);
  }
}
