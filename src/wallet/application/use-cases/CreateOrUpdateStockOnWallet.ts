import { WalletDto } from './../dto/wallet.dto';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletService } from '../../domain/services/wallet.service';
import { StockService } from '../../../stock/domain/services/stock.service';
import { ObjectId } from 'mongodb';

export class CreateOrUpdateStockOnWallet {
  constructor(
    private readonly walletService: WalletService,
    private readonly stockService: StockService,
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
        newStocks = userStocks.reduce((acc: Wallet['stock'], stock) => {
          if (stock.stockId.equals(stockInput.id)) {
            acc.push({
              stockId: stockInput.id,
              quantity:
                (Number.isNaN(stock.quantity) ? 0 : stock.quantity) +
                (WalletDto?.quantity ?? 0),
              note: WalletDto.note,
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
      return this.walletService.updateOne({
        query: {
          userId: userId,
        },
        update: {
          stock: newStocks,
        },
      });
    }
  }
}
