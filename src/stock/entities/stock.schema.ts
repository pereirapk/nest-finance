import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema()
export class Stock {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  changePercent?: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

export type StockResponseType = {
  id: string;
  symbol?: string;
  price?: number;
  type?: string;
  changePercent?: string;
  _id?: string;
};


