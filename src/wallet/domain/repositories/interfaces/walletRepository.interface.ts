import { ObjectId } from 'mongodb';
import { WalletDocument } from '../../entities/wallet.schema';
export interface WalletRepositoryInterface {
  save({
    query,
    update,
  }: {
    query: Partial<WalletDocument>;
    update: Partial<WalletDocument>;
  }): Promise<any>;
  getStock(): Promise<any>;
  getBySymbol(symbol: string, userId: ObjectId): Promise<any>;
  getByUser(userId: ObjectId): Promise<any>;
  deleteStockfromWallet(stockId: ObjectId, walletId: ObjectId): Promise<any>;
}
