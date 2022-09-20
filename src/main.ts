import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import * as session from 'express-session';
import * as passport from 'passport';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // app.useGlobalInterceptors(new ErrorsInterceptor());
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
