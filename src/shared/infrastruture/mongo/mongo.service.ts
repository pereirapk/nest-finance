import { Injectable, OnModuleInit } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { stockSchema } from 'src/stock/domain/entities/stock.entity';
import { userSchema } from 'src/user/entities/user.entity';
import { walletSchema } from 'src/wallet/domain/entities/wallet.entity';

@Injectable()
export class MongoService implements OnModuleInit {
  private connection: MongoClient;
  private mongoDb: Db;
  private walletCollection;
  private stockCollection;
  private userCollection;

  async onModuleInit() {
    this.connection = await MongoClient.connect(process.env.DB_URL);
    console.log('MongoService initialized');
    this.mongoDb = this.connection.db('finance');

    this.walletCollection = await this.mongoDb.command({
      collMod: 'wallet',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id', 'userId', 'stock'],
          properties: {
            id: { bsonType: 'objectId' },
            userId: { bsonType: 'objectId' },
            stock: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['stockId', 'quantity', 'note'],
                properties: {
                  stockId: { bsonType: 'objectId' },
                  quantity: { bsonType: 'int' },
                  note: { bsonType: 'double' },
                },
              },
            },
          },
        },
      },
    });
    this.stockCollection = await this.mongoDb.command({
      collMod: 'stock',
      validator: { $jsonSchema: stockSchema },
    });
    this.userCollection = await this.mongoDb.command({
      collMod: 'user',
      validator: { $jsonSchema: userSchema },
    });
  }

  public get WalletCollection() {
    return this.walletCollection;
  }
  public get StockCollection() {
    return this.stockCollection;
  }
  public get UserCollection() {
    return this.userCollection;
  }
}
