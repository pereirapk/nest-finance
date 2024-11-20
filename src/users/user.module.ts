import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [UsersController],             
  providers: [UsersService],                 
  exports: [UsersService],                    
})
export class UsersModule {}
