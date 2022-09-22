import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-microsoft';
require('dotenv').config();

// const clientID = process.env.MICROSOFT_CLIENT_ID;
// const tenantID = process.env.TENANT_ID;

/**
 * Extracts ID token from header and validates it.
 */
@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MIC_CLIENT_SECRET,
      resource: process.env.MIC_CLIENT_SECRET,
      tenant: process.env.TENANT,
      callbackURL: process.env.MIC_CALLBACK_URL,
      scope: ['user.read'],
      prompt: 'select_account',
    });
  }

  authorizationParams(options: any) {
    return Object.assign(options, {
      prompt: 'select_account',
    });
  }

  authenticate(req, option) {
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
    accessTOken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const jsonProfile = (profile && profile._json) || {};
    const user = {
      firstName: jsonProfile.givenName,
      lastName: jsonProfile.surname,
      email: jsonProfile.userPrincipalName,
      access_token: accessTOken,
      picture: null,
    };
    done(null, user);
  }
}
