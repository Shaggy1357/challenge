import { UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/users.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':email')
  async findbyemail(@Param('email') email: string): Promise<UserEntity> {
    // console.log(req.user.userEmail);
    return await this.usersService.finByEmail(email);
  }
}
