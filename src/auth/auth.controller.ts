import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Handles login routes.
  //Send user details in the form of a DTO to the auth service.
  @Post('/login')
  async login(@Body() authLoginDto: AuthLogin) {
    return await this.authService.login(authLoginDto);
  }
}
