import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUsers } from '../entities/GoogleUsers.entity';
import { Repository } from 'typeorm';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { Users } from '../entities/users.entity';
import { UserService } from '../user/user.service';
import { UserDetails } from './utils/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(GoogleUsers) private googleUsers: Repository<GoogleUsers>,
  ) {}

  //Validates users by comparing their saved passwords and entered passwords.
  async validateUser(authLoginDto: AuthLogin): Promise<Users> {
    //Finding for existing users with entered email.
    const user = await this.userService.findByEmail(authLoginDto.email);
    //Comparing passwords.
    if (!(await user?.validatepassword(authLoginDto.password))) {
      throw new UnauthorizedException("Username or password doesn't match!");
    }
    //Returning user.
    return user;
  }
  async login(authLoginDto: AuthLogin) {
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

  async ValidateUser(details: UserDetails) {
    console.log(details);
    const user = await this.googleUsers.findOneBy({ email: details.email });
    console.log(user);
    if (user) {
      return user;
    }
    const newUser = this.googleUsers.create(details);
    return this.googleUsers.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.googleUsers.findOneBy({ id });
    return user;
  }

  async Login(user) {
    return user;
  }
}
