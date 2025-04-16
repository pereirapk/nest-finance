import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

export interface StockInWallet {
  stockId: mongoose.Types.ObjectId;
  quantity: number;
  note: number;
}

@Schema()
export class Wallet {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: [
      {
        stockId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        note: { type: Number, required: true },
      },
    ],
  })
  stock: StockInWallet[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

export type SaveInputType = {
  query: Partial<Wallet>;
  update: Partial<Wallet>;
};

export type SaveResonseType = {
  response: Partial<Wallet>;
};