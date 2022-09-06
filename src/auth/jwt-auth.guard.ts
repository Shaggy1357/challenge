import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
// import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
require('dotenv').config();

//Creating custom guard using passport jwt.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //Importing instances of userService and jwt srvices.
  constructor(
    // private redisService: RedisService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async canActivate(context: ExecutionContext) {
    //Getting request details.
    const req = context.switchToHttp().getRequest();

    //Getting the token from the request raw headers bearer.
    const tok = req.rawHeaders[1].split(' ');
    const tok1 = tok[1];

    //Decoding the token for getting payload details.
    const decoded = this.jwtService.decode(tok1);

    //Assigning the logged in user details to request details.
    req.user = decoded;

    //Getting the saved token from DB.
    const tok2 = await this.userService.getToken(req.user.userId);

    //Comparing if the tokens match.
    if (tok2) {
      const fin = tok2.token;
      if (tok1 === fin) {
        throw new UnauthorizedException(
          'U have loggedout. Please login again!',
        );
      }
    }
    return true;
  }
}
