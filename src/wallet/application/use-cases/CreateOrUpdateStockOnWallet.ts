import { WalletDto } from './../dto/wallet.dto';
import { WalletService } from '../../domain/services/wallet.service';
import { StockService } from '../../../stock/domain/services/stock.service';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { WalletType } from 'src/wallet/domain/entities/wallet.entity';
import { WalletRepository } from 'src/wallet/domain/repositories/wallet.repository';
@Injectable()
export class CreateOrUpdateStockOnWallet {
  constructor(
    private readonly walletService: WalletService,
    private readonly stockService: StockService,
    private readonly walletRepository: WalletRepository
  ) {}
  async execute(WalletDto: WalletDto, userId: ObjectId) {
    if (WalletDto.symbol) {
      const stockInput = await this.stockService.getStock({
        symbol: WalletDto.symbol,
      });
      const walletUser = await this.walletService.getByUser(userId);
      let newStocks = [];
      const userStocks = walletUser?.stocks ?? [];

      if (userStocks.some((a) => a.stockId.equals(stockInput.id))) {
        newStocks = userStocks.reduce((acc: WalletType['stock'], stock) => {
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
        newStocks = [
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
        stocks: newStocks,
      });
      return "ok"
     ;
    }
  }
}
