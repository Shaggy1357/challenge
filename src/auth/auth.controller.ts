import { Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { GoogleAuthGuard } from './utils/GoogleAuthGuard';
import { Request } from 'express';

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
  async Login() {
    // console.log('second', user);
  }

  //Redirect endpoint
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async HandleRedirect(@Req() req: Request) {
    console.log('second', req.user);
    const user = req.user;
    return this.authService.Login(user);
  }

  // @Get('.well-known/microsoft-identity-association.json')
  // async microsoftJson(@Res() res) {
  //   return this.authService.microsoftJson(res);
  // }

  @Get('microsoft/login')
  @UseGuards(AuthGuard('microsoft'))
  async MicrosftLogin() {}

  @Get('microsoft/redirect')
  @UseGuards(AuthGuard('microsoft'))
  async HandleMicRedirect(@Req() req) {
    return this.authService.microsoftLogin(req);
  }
}
