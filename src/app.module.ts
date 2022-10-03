import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { AddressBook } from './entities/addressBook.entity';
// import { RedisModule } from './redis/redis.module';
import { BlackList } from './entities/blacklist.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleUsers } from './entities/GoogleUsers.entity';
import { PassportModule } from '@nestjs/passport';
import { MicrosoftUsers } from './entities/MicrosoftUsers.entity';
import { StripeModule } from './stripe/stripe.module';
import { StripeCustomers } from './entities/StripeCustomers.entity';

require('dotenv').config();

@Module({
  imports: [
    StripeModule.forRoot(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      timezone: 'UTC',
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Users,
        AddressBook,
        BlackList,
        GoogleUsers,
        MicrosoftUsers,
        StripeCustomers,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    StripeModule,
    /*RedisModule,*/
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [],
})
export class AppModule {}
