import { Injectable, Inject, NotFoundException, ConflictException, InternalServerErrorException, HttpStatus, Get } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { WalletDto } from '../dto/wallet.dto';
import { query } from 'express';

@Injectable()
export class UsersService {
}

@Injectable()
export class WalletService {
    private db;
    private walletsCollection;

    constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
        this.db = this.client.db('finance');
        this.walletsCollection = this.db.collection('wallets');

    }
    
    async create(walletDto: WalletDto): Promise<any> {
        try {
            const stock = await this.walletsCollection.insertOne(walletDto);
            if (stock.acknowledged === false) {
              throw new ConflictException('Ação não pode ser adicionada na carteira');
            }
            return {
              statusCode: HttpStatus.CREATED,
              message: 'Ação adicionada a carteira',
              data: {
                quantity: walletDto.quantity,
              },
            };
        } catch (error) {
            throw new InternalServerErrorException('Ação não pode ser adicionada na carteira');
        }
    };

    async findBySymbol(symbol: string, id_user: ObjectId): Promise<any> {
        const query = {
            symbol: symbol,
            id_user: id_user
        }
        const stock = await this.walletsCollection.findOne(query);
        if (!stock) {
            throw new NotFoundException('Ação não encontrada');
        }
        return stock;
    }
    async findByUser(userId: ObjectId): Promise<any> {
        const wallet = await this.walletsCollection.find({ userId });
        if (!wallet) {
            throw new NotFoundException('Carteira não encontrada');
        }
        return wallet;
    }
}
