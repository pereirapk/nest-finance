import { Types, ObjectId } from 'mongoose';
import { StockRepository } from "../repositories/stock.repository";

export class DeleteStockUseCase {
    constructor(
      private readonly stockRepository: StockRepository
    ) {}
    async execute(symbol: string){
        this.stockRepository.delete(symbol)
    }
}