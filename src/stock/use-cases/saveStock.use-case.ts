import { StockDto } from "../dto/stock.dto";
import { StockRepository } from "../repositories/stock.repository";

export class SaveStockUseCase {
    constructor(
      private readonly stockRepository: StockRepository
    ) {}
    async execute(stockDto: StockDto){
        this.stockRepository.save(stockDto)
    }
}