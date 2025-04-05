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
    const { stockId, quantity, note } = update.stock[0];

    const updateResult = await this.mongoDb.WalletCollection.updateOne(
      {
        userId: query.userId,
        'stocks.stockId': stockId,
      },
      {
        $set: {
          'stocks.$.quantity': quantity,
          'stocks.$.note': note,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      const walletExists = await this.mongoDb.WalletCollection.findOne({
        userId: query.userId,
      });

      if (!walletExists) {
        // Cria o documento com a stock inicial
        await this.mongoDb.WalletCollection.create({
          userId: query.userId,
          stocks: [
            {
              stockId: stockId,
              quantity: quantity,
              note: note,
            },
          ],
        });
      } else {
        // Adiciona a nova stock ao array existente
        await this.mongoDb.WalletCollection.updateOne(
          { userId: query.userId },
          {
            $push: {
              stocks: {
                stockId: stockId,
                quantity: quantity,
                note: note,
              },
            },
          },
        );
      }

      const wallet = this.mongoDb.WalletCollection.findOne({
        userId: query.userId,
      });

      return { response: wallet } as SaveResonseType;
    }
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
    const wallet = await this.mongoDb.WalletCollection.findOne({ userId });
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
      { $pull: { stocks: { stockId: stockId } } },
    );
    return 'ok';
  }
}