import { ObjectId } from 'mongodb';

export const stockSchema = {
  id: ObjectId,
  price: Number,
  type: String,
};

export type StockType = typeof stockSchema;
