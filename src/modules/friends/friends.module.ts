import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { FriendsController } from './controllers/friends.controller';
import { FriendGettingService } from './services/friend-getting.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [FriendsController],
  providers: [FriendGettingService],
  exports: [],
})
export class FriendsModule {}
