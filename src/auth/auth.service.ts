import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from '../dtos/AuthLogin.dto';
import { UserEntity } from '../entities/users.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //Validates users by comparing their saved passwords and entered passwords.
  async validateUser(authLoginDto: AuthLoginDto): Promise<UserEntity> {
    //Finding for existing users with entered email.
    const user = await this.userService.findByEmail(authLoginDto.email);
    //Comparing passwords.
    if (!(await user?.validatepassword(authLoginDto.password))) {
      throw new UnauthorizedException("Username or password doesn't match!");
    }
    //Returning user.
    return user;
  }
  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    //Defining payload for jwt token generation.
    const payload = {
      userId: user.id,
      userEmail: user.email,
    };
    //Returning the token after successfull login.
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
