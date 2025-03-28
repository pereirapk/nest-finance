//NAO VAI USAR

import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoService } from './mongo.service';
@Global()
@Module({
  imports: [],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
