import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FriendRequest from 'src/database/entities/friend-request.entity';
import { UsernameModule } from '../username/username.module';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestCheckingService } from './services/friend-request-checking.service';
import { FriendRequestRespondingService } from './services/friend-request-responding.service';
import { FriendRequestSendingService } from './services/friend-request-sending.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UsernameModule],
  controllers: [FriendRequestController],
  providers: [
    FriendRequestSendingService,
    FriendRequestCheckingService,
    FriendRequestRespondingService,
  ],
  exports: [FriendRequestCheckingService],
})
export class FriendRequestsModule {}
