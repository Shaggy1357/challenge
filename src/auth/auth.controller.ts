import { Get, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';
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
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async Login() {}

  //Redirect endpoint
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async HandleRedirect() {
    return { msg: 'OK!' };
  }
}
