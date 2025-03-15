import { Module } from '@nestjs/common';
import { UsersController } from './infrastruture/controllers/users.controller';
import { UsersService } from './domain/services/users.service';
import { DatabaseModule } from 'src/shared/infrastruture/database/database.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [UsersController],             
  providers: [UsersService],                 
  exports: [UsersService],                    
})
export class UsersModule {}
