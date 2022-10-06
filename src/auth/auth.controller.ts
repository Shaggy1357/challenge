import { Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';
import { AuthLogin } from '../dtos/AuthLogin.dto';
import { AuthService } from './auth.service';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { GoogleAuthGuard } from './utils/GoogleAuthGuard';
import { Request } from 'express';
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
    // console.log('request', req.query.code);
    return this.authService.microsoftLogin(req);
  }

  // @Get('microsoft/photo')
  // @UseGuards(AuthGuard('microsoft'))
  // async photo() {
  //   return this.authService.getphoto();
  // }

  @Get('stripe')
  listCustomers() {
    const customers = this.stripe.customers.list();
    // console.log(customers);

    // const balance = this.stripe.balance.retrieve();
    // console.log(balance);

    return customers;
  }

  // @Get('stripe/findone')
  // findone(){
  //   const customer = this.stripe.customers.createSource()
  // }

  // @Post('stripe/register')
  // async stripeUser(@Body() body) {
  //   // console.log('first', body);
  //   const name = body.name;
  //   // console.log('name', name);

  //   const email = body.email;
  //   // console.log('email', email);

  //   const newUser = await this.stripe.customers.create({
  //     name,
  //     email,
  //   });

  //   const customerId = newUser.id;
  //   const cardToken = await this.stripe.tokens.create({
  //     card: {
  //       name: body.cardName,
  //       number: body.cardNumber,
  //       exp_month: body.exp_month,
  //       exp_year: body.exp_year,
  //       cvc: body.cvc,
  //       address_country: body.address_country,
  //       address_zip: body.address_zip,
  //     },
  //   });

  //   const card = await this.stripe.customers.createSource(customerId, {
  //     source: cardToken.id,
  //   });
  //   // console.log(newUser);
  //   return this.authService.stripeRegister(body, newUser,receiptUrl);
  // }

  // @Post('stripe/addcard')
  // async addcard(@Body() body) {
  //   const cardToken = await this.stripe.tokens.create({
  //     card: {
  //       name: body.cardName,
  //       number: body.cardNumber,
  //       exp_month: body.exp_month,
  //       exp_year: body.exp_year,
  //       cvc: body.cvc,
  //       address_country: body.address_country,
  //       address_zip: body.address_zip,
  //     },
  //   });

  //   const customerId = 'cus_MVvaPu6BXxteIZ';

  //   const card = await this.stripe.customers.createSource(customerId, {
  //     source: cardToken.id,
  //   });
  //   console.log(card.id);
  // }

  // @Post('stripe/createpaymentintent')
  // async createPayments(@Body() amount) {
  //   // console.log('amount', amount);
  //   // console.log(amount.amount);

  //   const payment = await this.stripe.paymentIntents.create({
  //     amount: amount.amount,
  //     currency: 'USD',
  //     payment_method_types: ['card'],
  //   });
  //   console.log('payment', payment);

  //   return this.authService.createPayment(payment);
  // }

  // @Post('stripe/retrievepaymentintent')
  // async retrievePayments() {
  //   const payment = await this.stripe.paymentIntents.retrieve(
  //     'pi_3LndUBSArpHYeS850Lf11biF',
  //   );
  //   return payment;
  // }

  // @Post('stripe/charge')
  // async charges(@Body() body) {
  //   const name = body.name;

  //   const email = body.email;
  //   const newUser = await this.stripe.customers.create({ name, email });
  //   // const customerId = 'cus_MVvaPu6BXxteIZ';
  //   const cardToken = await this.stripe.tokens.create({
  //     card: {
  //       name: body.cardName,
  //       number: body.cardNumber,
  //       exp_month: body.exp_month,
  //       exp_year: body.exp_year,
  //       cvc: body.cvc,
  //     },
  //   });

  //   // // // console.log(cardToken);

  //   const card = await this.stripe.customers.createSource(newUser.id, {
  //     source: cardToken.id,
  //   });
  //   // const charge = await this.stripe.charges.create({
  //   //   amount: 2000,
  //   //   currency: 'usd',
  //   //   receipt_email: newUser.email,
  //   //   description: 'First charge',
  //   //   customer: newUser.id,
  //   //   source: card.id,
  //   // });
  //   const payment = await this.stripe.paymentIntents.create({
  //     amount: body.amount,
  //     currency: 'USD',
  //     payment_method_types: ['card'],
  //     payment_method: card.id,
  //     customer: newUser.id,
  //     description: 'First payment',
  //     // payment_method: card.id,
  //     capture_method: 'automatic',
  //     confirm: true,
  //     confirmation_method: 'automatic',
  //   });
  //   return payment;
  // }

  // @Post('stripe/retrievecharge')
  // async retrievecharge(@Body() body) {
  //   const cardToken = await this.stripe.tokens.create({
  //     card: {
  //       name: body.cardName,
  //       number: body.cardNumber,
  //       exp_month: body.exp_month,
  //       exp_year: body.exp_year,
  //       cvc: body.cvc,
  //     },
  //   });
  //   const paymentId = body.payment_intendId;

  //   const payment = await this.stripe.paymentIntents.retrieve(paymentId);

  //   const secret = payment.client_secret;

  //   console.log('secret', secret);

  //   const paymentIntent = await this.stripe.paymentIntents.confirm(paymentId);

  //   // const capturepayment = await this.stripe.paymentIntents.capture(paymentId);
  //   // console.log(paymentIntent);

  //   return paymentIntent;
  // }

  @Post('stripe/createcharge')
  async createcharge(@Body() body) {
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
      amount: 200,
      currency: 'inr',
      source: card.id,
      description: 'First charge',
      customer: newUser.id,
      receipt_email: newUser.email,
    });

    const receiptUrl = charge.receipt_url;

    return this.authService.stripeRegister(body, newUser, receiptUrl);
  }

  @Post('stripe/confirmcharge')
  async confirmpayment(@Body() body) {
    const paymentId = body.paymentId;
    const capturepayment = await this.stripe.paymentIntents.capture(paymentId);
  }

  @Post('twilio/message')
  async sendMessage(@Body() body) {
    return this.authService.message(body);
  }
}
