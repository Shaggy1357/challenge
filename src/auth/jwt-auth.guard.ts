import { BadRequestException, CanActivate } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { ExtractJwt } from 'passport-jwt';
import { RedisService } from '../redis/redis.service';
require('dotenv').config();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {
    super({
      //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const tok = req.rawHeaders[1].split(' ');
    const tok1 = tok[1];
    console.log('first---', tok1);
    const token = this.jwtService.decode(tok1);
    console.log('second---', token);
    req.user = token;

    // console.log();
    const tok2 = await this.redisService.get('token');
    // throw new UnauthorizedException('U have loggedout. Please login again!');
    console.log('third---', tok2);
    // req.user = {
    //   name: 'testxyz',
    // };

    if (tok[1] === this.redisService.get('token')) {
      throw new BadRequestException('U have loggedout. Please login again!');
    }
    return true;
  }
}
