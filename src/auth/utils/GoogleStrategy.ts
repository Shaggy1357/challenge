import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
require('dotenv').config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(AccessToken: string, RefreshToken: string, profile: Profile) {
    console.log('AccessToken', AccessToken);
    console.log('RefreshToken', RefreshToken);
    console.log('profile', profile);
  }
}
