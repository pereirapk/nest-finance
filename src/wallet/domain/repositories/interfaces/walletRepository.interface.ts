import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

export interface WalletRepositoryInterface {
    save(): Promise<void>;
    getStock(): Promise<any>;
    getBySymbol(symbol: string, userId:ObjectId): Promise<any> 
    getByUser(userId: ObjectId): Promise<any> 
    deleteStockfromWallet(stockId: ObjectId, walletId: ObjectId): Promise<any>
}
