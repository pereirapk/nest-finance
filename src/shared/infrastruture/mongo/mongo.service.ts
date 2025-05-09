import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from 'src/stock/entities/stock.schema';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { Wallet, WalletDocument } from 'src/wallet/entities/wallet.schema';


@Injectable()
export class MongoService implements OnModuleInit {
  

  constructor(
    @InjectModel(User.name) private userCollection: Model<UserDocument>,
    @InjectModel(Stock.name) private stockCollection: Model<StockDocument>,
    @InjectModel(Wallet.name) private walletCollection: Model<WalletDocument>,
  ) {}

  async onModuleInit() {
    
    console.log('MongoService initialized');
    
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
