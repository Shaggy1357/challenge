import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
require('dotenv').config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['profile', 'email'],
      prompt: 'select_account',
    });
  }

  authorizationParams(options: any): any {
    return Object.assign(options, {
      prompt: 'select_account',
    });
  }

  async validate(AccessToken: string, RefreshToken: string, profile: Profile) {
    console.log('AccessToken', AccessToken);
    console.log('RefreshToken', RefreshToken);
    console.log('profile', profile);
    const user = await this.authService.ValidateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });
    console.log('first', user);
    return user || null;
  }
}
