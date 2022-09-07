import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { AddressBook } from './entities/addressBook.entity';
import { RedisModule } from './redis/redis.module';
import { BlackList } from './entities/blacklist.entity';

require('dotenv').config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, AddressBook, BlackList],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    /*RedisModule,*/
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [],
})
export class AppModule {}
