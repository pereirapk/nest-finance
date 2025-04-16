import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/shared/auth/dto/login.dto';
import { MongoService } from 'src/shared/infrastruture/mongo/mongo.service';

@Injectable()
export class UserRepository {
  constructor(private readonly mongoDb: MongoService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.mongoDb.UserCollection.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email já existe');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashedPassword };
    try {
      const result = await this.mongoDb.UserCollection.create(user);
      console.log(result)
      if (result === null) {
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
    const user = this.mongoDb.UserCollection.findOne({ email });
  
    console.log({ user })
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
  async updatePassword(
    email: string,
    UpdatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const isEqual = await bcrypt.compare(
      UpdatePasswordDto.old_password,
      user.password,
    );
    if (!isEqual) {
      throw new ConflictException('Senha antiga incorreta');
    }
    const hashedPassword = await bcrypt.hash(
      UpdatePasswordDto.new_password,
      10,
    );
  }
  async findByLogin({ email, password }: LoginDto): Promise<any> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const isEqual = await bcrypt.compareSync(password, user.password);
    if (!isEqual) {
      throw new ConflictException('Senha antiga incorreta');
    }
    const { password: p, ...rest } = user;
    return rest;
  }
  async delete(email: string): Promise<any> {
    this.mongoDb.UserCollection.deleteOne({ email });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Ação deletada com sucesso',
    };
  }
}
