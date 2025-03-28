import { ObjectId } from 'mongodb';

export const walletSchema = {
  id: ObjectId,
  userId: ObjectId,
  stock: [
    {
      stockId: ObjectId,
      quantity: Number,
      note: Number,
    },
  ],
};

export type WalletType = typeof walletSchema;

export type SaveInputType = {
  query: Partial<WalletType>;
  update: Partial<WalletType>;
};

export type SaveResonseType = {
  response: Partial<WalletType>;
};
