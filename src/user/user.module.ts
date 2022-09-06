import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { AddressBook } from '../entities/addressBook.entity';
// import { RedisModule } from '../redis/redis.module';
// import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { BlackList } from '../entities/blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AddressBook,
      BlackList,
    ]) /*RedisModule*/,
  ],
  providers: [UserService /*RedisService*/, JwtService],
  controllers: [UserController],
  exports: [UserService /*RedisService*/, JwtService],
})
export class UserModule {}
