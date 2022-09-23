import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express-serve-static-core';
import { BearerStrategy } from 'passport-azure-ad';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-microsoft';
import { AuthService } from '../auth.service';
require('dotenv').config();

// const clientID = process.env.MICROSOFT_CLIENT_ID;
// const tenantID = process.env.TENANT_ID;

/**
 * Extracts ID token from header and validates it.
 */
@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MIC_CLIENT_SECRET,
      resource: process.env.MIC_CLIENT_SECRET,
      tenant: process.env.TENANT,
      callbackURL: process.env.MIC_CALLBACK_URL,
      scope: ['user.read', 'user.read.all'],
      prompt: 'select_account',
    });
  }

  authorizationParams(options: any) {
    return Object.assign(options, {
      prompt: 'select_account',
    });
  }

  authenticate(req: Request, option) {
    option.prompt = 'select_account';
    if (req.query?.invitedToken) {
      option.state = `${req.headers.host}|${req.query.invitedToken}`;
      super.authenticate(req, option);
    } else {
      option.state = req.headers.host;
      super.authenticate(req, option);
    }
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: any,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log('first', profile);

    const jsonProfile = refreshToken._json || {};
    console.log('refreshToken', jsonProfile);
    console.log('typeof', typeof refreshToken);

    // const user =

    const user = await this.authService.ValidateMicrosoftUser({
      firstName: jsonProfile.givenName,
      lastName: jsonProfile.surname,
      email: jsonProfile.userPrincipalName,
      // access_token: accessToken,
      // picture: null,
    });
    console.log('third', user);

    return user;
    // done(null, user);
  }
}
