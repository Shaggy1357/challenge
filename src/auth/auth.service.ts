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

  async validateUser(authLoginDto: AuthLoginDto): Promise<UserEntity> {
    const user = await this.userService.finByEmail(authLoginDto.email);
    if (!(await user?.validatepassword(authLoginDto.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const payload = {
      userId: user.id,
      userEmail: user.email,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
