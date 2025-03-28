import { Module } from '@nestjs/common';
import { UsersController } from './infrastruture/controllers/users.controller';
import { UsersService } from './domain/services/users.service';
import { MongoModule } from 'src/shared/infrastruture/mongo/mongo.module';

@Module({
  imports: [MongoModule], 
  controllers: [UsersController],             
  providers: [UsersService],                 
  exports: [UsersService],                    
})
export class UsersModule {}
