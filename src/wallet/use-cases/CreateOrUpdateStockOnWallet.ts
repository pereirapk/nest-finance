import { WalletDto } from '../dto/wallet.dto';
import { StockRepository } from '../../stock/repositories/stock.repository';
import { ObjectId,Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { WalletDocument } from 'src/wallet/entities/wallet.schema';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
@Injectable()
export class CreateOrUpdateStockOnWallet {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly walletRepository: WalletRepository
  ) {}
  async execute(WalletDto: WalletDto, userId: Types.ObjectId) {
    if (WalletDto.symbol) {
      let stockInput = await this.stockRepository.getStock({
        symbol: WalletDto.symbol,
      });
      if (stockInput === null) {
      stockInput = await this.stockRepository.getStockPrice(
          WalletDto.symbol,
        );
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
        // if not has stock in wallet
        newStock = [
          ...(walletUser?.stock),
          {
            stockId: stockInput?.id,
            quantity: (stockInput?.quantity ?? 0) + WalletDto?.quantity,
            note: WalletDto.note,
          },
        ];
      }
      return await this.walletRepository.save({
        query: { ...walletUser },
        update: { userId: walletUser.userId,
        stock: newStock},
      });
      
    }
  }
}
