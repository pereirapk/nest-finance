import { ObjectId, Types } from 'mongoose';
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
  getBySymbol(symbol: string, userId: Types.ObjectId): Promise<any>;
  getByUser(userId: Types.ObjectId): Promise<any>;
  deleteStockfromWallet(stockId: Types.ObjectId, walletId: Types.ObjectId): Promise<any>;
}
