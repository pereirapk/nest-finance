import { Injectable } from '@nestjs/common';
import {
    Inject,
    NotFoundException,
  } from '@nestjs/common';
import { WalletRepositoryInterface } from './interfaces/walletRepository.interface';
import { MongoClient, ObjectId } from 'mongodb';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletRepository implements WalletRepositoryInterface
{
    private db;
    private walletsCollection;

    constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
        this.db = this.client.db('finance');
        this.walletsCollection = this.db.collection('wallets');
      }
    save(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getStock(): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async getBySymbol(symbol: string, userId:ObjectId): Promise<any> {
        const stock = await this.walletsCollection.findOne({ symbol, userId });
        if (!stock) {
          throw new NotFoundException('Ação não encontrada');
        }
        return stock;
      }
      async getByUser(userId: ObjectId): Promise<any> {
        const wallet = await this.walletsCollection.findOne({ userId });
        if (!wallet) {
          return null;
        }
        return wallet;
      }
      async deleteStockfromWallet(stockId: ObjectId, walletId: ObjectId): Promise<any> {
          await this.walletsCollection.deleteOne(
            { _id: walletId },
            { $pull: { stocks: { stockId: stockId } } }
          );
          return "ok"
        
      }
}