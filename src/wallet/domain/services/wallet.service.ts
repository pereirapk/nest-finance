import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  private db;
  private walletsCollection;

  constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
    this.db = this.client.db('finance');
    this.walletsCollection = this.db.collection('wallets');
  }

  async updateOne({
    query,
    update,
  }: {
    query: Partial<Wallet>;
    update: Partial<Wallet>;
  }): Promise<any> {
    const { stockId, quantity, note } = update.stock[0];
    const updateResult = await this.walletsCollection.updateOne(
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
      const walletExists = await this.walletsCollection.findOne({
        userId: query.userId,
      });

      if (!walletExists) {
        // Cria o documento com a stock inicial
        await this.walletsCollection.insertOne({
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
        await this.walletsCollection.updateOne(
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
      const wallet = this.walletsCollection.findOne({
        userId: query.userId,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Ação adicionada a carteira',
        data: {
          ...wallet,
          id: wallet._id,
        },
      };
    }
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
