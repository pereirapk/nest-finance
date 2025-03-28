import { ObjectId } from 'mongodb';
import { SaveResonseType, WalletType } from '../../entities/wallet.entity';
export interface WalletRepositoryInterface {
  save({
    query,
    update,
  }: {
    query: Partial<WalletType>;
    update: Partial<WalletType>;
  }): Promise<SaveResonseType>;
  getStock(): Promise<any>;
  getBySymbol(symbol: string, userId: ObjectId): Promise<any>;
  getByUser(userId: ObjectId): Promise<any>;
  deleteStockfromWallet(stockId: ObjectId, walletId: ObjectId): Promise<any>;
}
