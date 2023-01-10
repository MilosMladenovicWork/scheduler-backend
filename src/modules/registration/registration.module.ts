import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/database/entities/user.entity';
import { RegisterUserController } from './controllers/register-user.controller';
import { RegisterUserService } from './services/regiser-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RegisterUserController],
  providers: [RegisterUserService],
})
export class RegistrationModule {}
