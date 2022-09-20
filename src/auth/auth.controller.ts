import { Get, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { GoogleAuthGuard } from './utils/GoogleAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLogin) {
    return await this.authService.login(authLoginDto);
  }

  //Handles login routes.
  //Send user details in the form of a DTO to the auth service.
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async Login() {}

  //Redirect endpoint
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async HandleRedirect() {
    return { msg: 'OK!' };
  }
}
