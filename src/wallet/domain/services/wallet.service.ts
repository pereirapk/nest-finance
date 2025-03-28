import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { WalletType } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  private db;
  private walletCollection;


  async updateOne({
    query,
    update,
  }: {
    query: Partial<WalletType>;
    update: Partial<WalletType>;
  }): Promise<any> {
    const { stockId, quantity, note } = update.stock[0];
    const updateResult = await this.walletCollection.updateOne(
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
      const walletExists = await this.walletCollection.findOne({
        userId: query.userId,
      });

      if (!walletExists) {
        // Cria o documento com a stock inicial
        await this.walletCollection.insertOne({
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
        await this.walletCollection.updateOne(
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
      const wallet = this.walletCollection.findOne({
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
    const stock = await this.walletCollection.findOne({ symbol, userId });
    if (!stock) {
      throw new NotFoundException('Ação não encontrada');
    }
    return stock;
  }
  async getByUser(userId: ObjectId): Promise<any> {
    const wallet = await this.walletCollection.findOne({ userId });
    if (!wallet) {
      return null;
    }
    return wallet;
  }
  async deleteStockfromWallet(stockId: ObjectId, walletId: ObjectId): Promise<any> {
      await this.walletCollection.deleteOne(
        { _id: walletId },
        { $pull: { stocks: { stockId: stockId } } }
      );
      return "ok"
    
  }
}
