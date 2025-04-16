import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException, ConflictException } from '@nestjs/common';
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import { StockDto } from '../dto/stock.dto';
import { NotFoundException } from '@nestjs/common';
import { MongoService } from 'src/shared/infrastruture/mongo/mongo.service';


@Injectable()
export class StockService {
  private readonly apiKey: string = 'KEY'; 
  private readonly apiUrl: string = 'https://www.alphavantage.co/query';
  private db;
  private stockCollection;

  constructor(private readonly mongoDb: MongoService) {}
  

  async getStockPrice(symbol: string): Promise<any> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey,
        },
      });

      const stock = response.data['Global Quote'];

      if (!stock) {
        throw new HttpException('Ação não encontrada', HttpStatus.NOT_FOUND);
      }

      return {
        symbol: stock['01. symbol'],
        price: parseFloat(stock['05. price']),
        changePercent: stock['10. change percent'],
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao obter dados da API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getStock(query:Partial<StockDto>): Promise<any> {
    const stock = await this.mongoDb.StockCollection.findOne(query);

    if (!stock) {
      throw new NotFoundException('Ação não encontrada');
    }
    return { id: stock._id, ...stock};
  }
  async save(stockDto: StockDto) {
    try {

      /*updateOne {Search, Input, upsert}*/
      const stock = await this.mongoDb.StockCollection.findOneAndUpdate(
        { symbol: stockDto.symbol},
        { $set: stockDto},
        { upsert: true }
        );
        console.log(stock)
      if (stock._id === null) {
        throw new ConflictException('Ação não pode ser criada');
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Ação criada com sucesso',
        data: {
          id: stock._id,
          symbol: stock.symbol,
          price: stock.price,
          type: stock.type,
        },
      };
    } catch (error) {
        throw new InternalServerErrorException('Ação não pode ser criada');
    }
  };
  async delete(stockId: ObjectId): Promise<any> {
    this.mongoDb.StockCollection.deleteOne({ _id: stockId });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Ação deletada com sucesso',
    }
  }

}
