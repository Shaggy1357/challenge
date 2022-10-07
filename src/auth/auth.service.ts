import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUsers } from '../entities/GoogleUsers.entity';
import { Repository } from 'typeorm';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { Users } from '../entities/users.entity';
import { UserService } from '../user/user.service';
import { MicUserDetails, UserDetails } from './utils/types';
import { MicrosoftUsers } from '../entities/MicrosoftUsers.entity';
import { StripeCustomers } from '../entities/StripeCustomers.entity';
import { TwilioService } from 'nestjs-twilio';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './utils/types';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { AuthorizationCodeCredential } from '@azure/identity';
// import 'isomorphic-fetch';
require('isomorphic-fetch');
require('dotenv').config();

// const credential = new AuthorizationCodeCredential(
//   process.env.TENANT,
//   process.env.MICROSOFT_CLIENT_ID,
//   '<AUTH_CODE_FROM_QUERY_PARAMETERS>',
//   process.env.MIC_CALLBACK_URL,
// );
@Injectable()
export class AuthService {
  constructor(
    private twilioService: TwilioService,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(GoogleUsers) private googleUsers: Repository<GoogleUsers>,
    @InjectRepository(MicrosoftUsers)
    private microsoftUsers: Repository<MicrosoftUsers>,
    @InjectRepository(StripeCustomers)
    private stripeCustomers: Repository<StripeCustomers>,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
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

  async ValidateGoogleUser(details: UserDetails) {
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

  // async microsoftJson(res) {
  //   res.writeHeader(200, { 'Content-Type': 'application/json' });
  //   res.write(
  //     JSON.stringify({
  //       associatedApplicatons: [
  //         {
  //           applicationId: 'b29377a2-a48e-4b7a-b468-74fcc9a9694b',
  //         },
  //       ],
  //     }),
  //   );
  //   res.end();
  // }

  async microsoftLogin(req) {
    // console.log('request', req.query.code);
    // const credential = new AuthorizationCodeCredential(
    //   process.env.TENANT,
    //   process.env.MICROSOFT_CLIENT_ID,
    //   req.query.code,
    //   process.env.MIC_CALLBACK_URL,
    // );
    // // console.log('credential', credential);

    // const AuthProvider = new TokenCredentialAuthenticationProvider(credential, {
    //   scopes: ['user.read', 'user.read.all', 'user.readwrite.all'],
    // });
    // const client = Client.initWithMiddleware({ authProvider: AuthProvider });
    // // console.log('client', client);

    // const user = await client
    //   .api('/me')
    //   .select(['givenName', 'surname', 'mail'])
    //   .get();
    // console.log('user', user);

    return req.user;
  }

  async ValidateMicrosoftUser(details: MicUserDetails) {
    console.log(details);
    const user = await this.microsoftUsers.findOneBy({ email: details.email });
    console.log(user);
    if (user) {
      return user;
    }
    const newUser = this.microsoftUsers.create(details);
    return this.microsoftUsers.save(newUser);
  }

  // async getphoto(){
  //   const photo
  // }

  // async stripeRegister(body, newUser, receiptUrl) {
  //   // console.log('body', body);
  //   // console.log('newUser', newUser);
  //   const user = await this.stripeCustomers.create({
  //     ...body,
  //     stripeId: newUser.id,
  //     receiptURL: receiptUrl,
  //   });
  //   // // const user1 = await this.stripeCustomers.save({
  //   // //   ...newUser,
  //   // //   stripeId: newUser.id,
  //   // // });
  //   // console.log('user', user);
  //   return this.stripeCustomers.save(user);
  // }

  async stripeRegister(body) {
    const amount = body.amount;
    const name = body.name;
    const email = body.email;
    const newUser = await this.stripe.customers.create({
      name,
      email,
      address: {
        city: 'pune',
        country: 'India',
        line1: 'asdf',
        postal_code: '424242',
        state: 'Gujarat',
      },
    });
    const cardToken = await this.stripe.tokens.create({
      card: {
        name: body.cardName,
        number: body.cardNumber,
        exp_month: body.exp_month,
        exp_year: body.exp_year,
        cvc: body.cvc,
      },
    });
    const card = await this.stripe.customers.createSource(newUser.id, {
      source: cardToken.id,
    });
    const charge = await this.stripe.charges.create({
      amount: amount * 100,
      currency: 'inr',
      source: card.id,
      description: 'First charge',
      customer: newUser.id,
      receipt_email: newUser.email,
    });
    const receiptUrl = charge.receipt_url;
    const user = await this.stripeCustomers.create({
      ...body,
      stripeId: newUser.id,
      receiptURL: receiptUrl,
    });
    return this.stripeCustomers.save(user);
  }

  async message(body) {
    const phone = body.number;
    return this.twilioService.client.messages.create({
      body: 'First Twilio Message',
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  }

  async sendcode(body) {
    const phone = body.phone;
    return this.twilioService.client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });
  }

  async verifyCode(body) {
    const phone = body.phone;
    const code = body.code;
    const result = await this.twilioService.client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({ to: phone, code: code });

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided!');
    }

    return result.status;
  }
}
