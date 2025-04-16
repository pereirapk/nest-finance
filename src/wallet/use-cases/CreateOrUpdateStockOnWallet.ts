import { WalletDto } from '../dto/wallet.dto';
import { StockService } from '../../stock/services/stock.service';
import { ObjectId,Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { WalletDocument } from 'src/wallet/entities/wallet.schema';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
@Injectable()
export class CreateOrUpdateStockOnWallet {
  constructor(
    private readonly stockService: StockService,
    private readonly walletRepository: WalletRepository
  ) {}
  async execute(WalletDto: WalletDto, userId: Types.ObjectId) {
    if (WalletDto.symbol) {
      const stockInput = await this.stockService.getStock({
        symbol: WalletDto.symbol,
      });
      const walletUser = await this.walletRepository.getByUser(userId);
      let newStock = [];
      const userStock = walletUser?.stocks ?? [];

      if (userStock.some((a) => a.stockId.equals(stockInput.id))) {
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
        newStock = [
          ...(walletUser?.stock || []),
          {
            stockId: stockInput?.id,
            quantity: (stockInput?.quantity ?? 0) + WalletDto?.quantity,
            note: WalletDto.note,
          },
        ];
      }
      this.walletRepository.save({
        ...walletUser,
        stocks: newStock,
      });
      return "ok"
     ;
    }
  }
}
