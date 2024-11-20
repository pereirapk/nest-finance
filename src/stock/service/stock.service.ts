import { Injectable, Inject, HttpException, HttpStatus, InternalServerErrorException, ConflictException } from '@nestjs/common';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { StockDto } from '../dto/stock.dto';


@Injectable()
export class StockService {
  private readonly apiKey: string = 'KEY'; 
  private readonly apiUrl: string = 'https://www.alphavantage.co/query';
  private db;
  private stocksCollection;

  constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
    this.db = this.client.db('finance');
    this.stocksCollection = this.db.collection('stocks'); 
  }

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
  async create(stockDto: StockDto): Promise<any> {
    try {
      const stock = await this.stocksCollection.insertOne(stockDto);
      if (stock.acknowledged === false) {
        throw new ConflictException('Ação não pode ser criada');
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Ação criada com sucesso',
        data: {
          symbol: stockDto.symbol,
          price: stockDto.price,
          type: stockDto.type,
          note: stockDto.note,
        },
      };
    } catch (error) {
        throw new InternalServerErrorException('Ação não pode ser criada');
    }
  };
}
