import { Injectable, OnModuleInit } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { walletSchema } from 'src/wallet/domain/entities/wallet.entity';

@Injectable()
export class MongoService implements OnModuleInit {
  private connection: MongoClient;
  private mongoDb: Db;
  private walletsCollection;

  async onModuleInit() {
    this.connection = await MongoClient.connect(process.env.DB_URL);
    console.log('MongoService initialized');
    this.mongoDb = this.connection.db('finance');

    this.walletsCollection = await this.mongoDb.command({
      collMod: 'wallets',
      validator: { $jsonSchema: walletSchema },
    });
  }

  public get WalletsCollection() {
    return this.walletsCollection;
  }
}
