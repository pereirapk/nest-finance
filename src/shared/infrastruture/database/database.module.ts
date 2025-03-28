//NAO VAI USAR

import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const uri = process.env.DB_URL;
        const client = new MongoClient(uri);
        return client.connect();
      },
      inject: [ConfigService],
    },
  ],

  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
