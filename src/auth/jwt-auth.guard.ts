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
    const gettingAssignedToken = req.rawHeaders[1].split(' ');
    const assignedToken = gettingAssignedToken[1];

    //Decoding the token for getting payload details.
    const decoded = this.jwtService.decode(assignedToken);

    //Assigning the logged in user details to request details.
    req.user = decoded;
    //Getting the saved token from DB.

    const gettingBlackListedToken = await this.userService.getToken(
      req.user.userId,
    );

    //Comparing if the tokens match.
    if (gettingBlackListedToken) {
      const blackListedToken = gettingBlackListedToken.token;
      if (assignedToken === blackListedToken) {
        throw new UnauthorizedException(
          'U have loggedout. Please login again!',
        );
      }
    }
    return true;
  }
}
