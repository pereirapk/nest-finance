import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { WalletRepositoryInterface } from './interfaces/walletRepository.interface';
import { ObjectId, Types } from 'mongoose';
import { SaveInputType, SaveResonseType } from '../entities/wallet.schema';
import { MongoService } from 'src/shared/infrastruture/mongo/mongo.service';

@Injectable()
export class WalletRepository implements WalletRepositoryInterface {
  constructor(private readonly mongoDb: MongoService) {}

  async save({ query, update }: SaveInputType): Promise<any> {
    const userId = update.userId;
    const { stockId, quantity, note } = update.stock[0];
    const updateResult = await this.mongoDb.WalletCollection.updateOne(
      {
        userId: userId,
        'stock.stockId': stockId,
      },
      {
        $set: {
          'stock.$.quantity': quantity,
          'stock.$.note': note,
        },
      },
    );
    if (updateResult.matchedCount === 0 || updateResult.acknowledged === false) {
        await this.mongoDb.WalletCollection.updateOne(
          { userId: userId },
          {
            $push: {
              stock: {
                stockId: stockId,
                quantity: quantity,
                note: note,
              },
            },
          },
        );
      }
      const wallet = await this.getByUser(userId);
      return { response: wallet } as SaveResonseType;
  }

  async create(userId: Types.ObjectId): Promise<any>{
    const response = await this.mongoDb.WalletCollection.create({
      userId: userId,
      stocks: [
      ],
    });
    return response;
  }
  getStock(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async getBySymbol(symbol: string, userId: Types.ObjectId): Promise<any> {
    const stock = await this.mongoDb.WalletCollection.findOne({
      symbol,
      userId,
    });
    if (!stock) {
      throw new NotFoundException('Ação não encontrada');
    }
    return stock;
  }
  async getByUser(userId: Types.ObjectId): Promise<any> {
    const wallet = await this.mongoDb.WalletCollection.findOne({
      userId: userId,
    });
    
    if (!wallet) {
      return null;
    }
    return wallet;
  }
  async deleteStockfromWallet(
    stockId: Types.ObjectId,
    walletId: Types.ObjectId,
  ): Promise<any> {
    await this.mongoDb.WalletCollection.deleteOne(
      { _id: walletId },
      { $pull: { stock: { stockId: stockId } } },
    );
    return 'ok';
  }
}