import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeOrm.config';
import { configurationFunction } from './config/configuration';
import { RegistrationModule } from './modules/registration/registration.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { UsernameModule } from './modules/username/username.module';
import { FriendRequestsModule } from './modules/friend-requests/friend-requests.module';
import { FriendsModule } from './modules/friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configurationFunction], isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    RegistrationModule,
    AuthModule,
    SchedulingModule,
    UsernameModule,
    FriendRequestsModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
