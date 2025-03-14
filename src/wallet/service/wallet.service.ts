import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { WalletDto } from '../dto/wallet.dto';

@Injectable()
export class WalletService {
  private db;
  private walletsCollection;

  constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
    this.db = this.client.db('finance');
    this.walletsCollection = this.db.collection('wallets');
  }

  async create(walletDto: WalletDto): Promise<any> {
    try {
      const stock = await this.walletsCollection.updateOne(
        { id_stock: walletDto.stockId, userId: walletDto.userId },
        { $set: walletDto },
        { upsert: true },
      );

      if (stock.acknowledged === false) {
        throw new ConflictException('Ação não pode ser adicionada na carteira');
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Ação adicionada a carteira',
        data: {
          quantity: walletDto.quantity,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ação não pode ser adicionada na carteira',
      );
    }
  }
  async updateOne({
    query,
    update,
  }: {
    query: Partial<WalletDto>;
    update: Partial<WalletDto>;
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
              stockId: query.userId,
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
}
