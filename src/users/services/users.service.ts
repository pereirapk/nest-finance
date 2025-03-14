import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { Injectable, Inject, NotFoundException, ConflictException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/login.dto';


@Injectable()
export class UsersService {
  private db;
  private usersCollection;

  constructor(@Inject('DATABASE_CONNECTION') private client: MongoClient) {
    this.db = this.client.db('finance');
    this.usersCollection = this.db.collection('users'); 
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersCollection.findOne( { email: createUserDto.email })
    if (existingUser) {
      throw new ConflictException('Email já existe');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashedPassword };
    try {
      const result = await this.usersCollection.insertOne(user);
     
      if (result.acknowledged === false) {
        throw new ConflictException('Usuário não pode ser criado');
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso',
        data: {
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Usuário não pode ser criado');
    }
  }

  async findByEmail(email: string): Promise<any> {
    const user =  this.usersCollection.findOne({ email });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado'); 
    }

    return user;
  }
  async updatePassword(email: string, UpdatePasswordDto: UpdatePasswordDto): Promise<any> {
      const user = await this.findByEmail(email);
      if(!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const isEqual = await bcrypt.compare(UpdatePasswordDto.old_password, user.password);
      if(!isEqual) {
        throw new ConflictException('Senha antiga incorreta');
      }
      const hashedPassword = await bcrypt.hash(UpdatePasswordDto.new_password, 10);
      this.usersCollection.updatePassword
  }
  async findByLogin({email, password}: LoginDto): Promise<any> {
    const user = await this.findByEmail(email);
    
    if(!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const isEqual = await bcrypt.compareSync(password, user.password);
      if(!isEqual) {
        throw new ConflictException('Senha antiga incorreta');
      }
      const {password: p, ...rest} = user;
      return rest;
  }
}
