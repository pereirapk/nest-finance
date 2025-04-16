import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { MongoModule } from 'src/shared/infrastruture/mongo/mongo.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [MongoModule], 
  controllers: [UserController],             
  providers: [UserRepository],                 
  exports: [UserRepository],                    
})
export class UserModule {}
