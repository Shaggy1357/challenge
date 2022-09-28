import { Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { GoogleAuthGuard } from './utils/GoogleAuthGuard';
import e, { Request } from 'express';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './utils/types';
// import { AzureADGuard } from './utils/azureAd.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLogin) {
    return await this.authService.login(authLoginDto);
  }

  //Handles login routes.
  //Send user details in the form of a DTO to the auth service.
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async Login() {
    // console.log('second', user);
  }

  //Redirect endpoint
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async HandleRedirect(@Req() req: Request) {
    console.log('second', req.user);
    const user = req.user;
    return this.authService.Login(user);
  }

  // @Get('.well-known/microsoft-identity-association.json')
  // async microsoftJson(@Res() res) {
  //   return this.authService.microsoftJson(res);
  // }

  @Get('microsoft/login')
  @UseGuards(AuthGuard('microsoft'))
  async MicrosftLogin() {}

  @Get('microsoft/redirect')
  @UseGuards(AuthGuard('microsoft'))
  async HandleMicRedirect(@Req() req) {
    return this.authService.microsoftLogin(req);
  }

  @Get('stripe')
  listCustomers() {
    const customers = this.stripe.customers.list();
    // console.log(customers);

    // const balance = this.stripe.balance.retrieve();
    // console.log(balance);

    return customers;
  }

  @Post('stripe/register')
  async stripeUser(@Body() body) {
    // console.log('first', body);
    const name = body.name;
    // console.log('name', name);

    const email = body.email;
    // console.log('email', email);

    const newUser = await this.stripe.customers.create({ name, email });
    // console.log(newUser);
    return this.authService.stripeRegister(body, newUser);
  }

  @Post('stripe/payment')
  async createPayments(@Body() amount, paymentMethodId, stripeId) {
    // console.log('amount', amount);
    // console.log(amount.amount);

    const payment = await this.stripe.paymentIntents.create({
      amount: amount.amount,
      currency: 'USD',
    });
    console.log('payment', payment);

    return this.authService.createPayment(payment);
  }
}
