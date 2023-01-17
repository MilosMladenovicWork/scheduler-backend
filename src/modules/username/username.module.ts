import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { UsernameCheckingService } from './services/username-checking.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsernameCheckingService],
  exports: [UsernameCheckingService],
})
export class UsernameModule {}
