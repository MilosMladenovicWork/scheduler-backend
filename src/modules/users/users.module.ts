import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UserGettingService } from './services/user-getting.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserGettingService],
  exports: [],
})
export class UsersModule {}
