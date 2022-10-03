import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import {
  AuthProvider,
  AuthProviderCallback,
  Client,
  ClientOptions,
  Options,
} from '@microsoft/microsoft-graph-client';
import { AzureADStrategy } from '../auth/utils/Azure.strategy';

// export const clientOptions: ClientOptions = {
//   authProvider: new AzureADStrategy(),
// };
// export const client = Client.init();
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
  //   const photo = await client
  // }

  async stripeRegister(body, newUser, receiptUrl) {
    // console.log('body', body);
    // console.log('newUser', newUser);
    const user = await this.stripeCustomers.create({
      ...body,
      stripeId: newUser.id,
      receiptURL: receiptUrl,
    });
    // // const user1 = await this.stripeCustomers.save({
    // //   ...newUser,
    // //   stripeId: newUser.id,
    // // });
    // console.log('user', user);
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
}
