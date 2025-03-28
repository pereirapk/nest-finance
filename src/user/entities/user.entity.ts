import { ObjectId } from 'mongodb';

export const userSchema = {
    id: ObjectId,
    name: String,
    email: String,
    password: String,
};

export type StockType = typeof userSchema;
