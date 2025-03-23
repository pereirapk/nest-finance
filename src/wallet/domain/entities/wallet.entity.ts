import { ObjectId } from "mongodb";

export class Wallet {
    id: ObjectId;
    userId: ObjectId;
    stock: {
        stockId: ObjectId,
        quantity: number,
        note: number
    }[]
}