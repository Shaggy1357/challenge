import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stripe } from 'stripe';
import { STRIPE_CLIENT } from '../auth/utils/types';
import { StripeCustomers } from '../entities/StripeCustomers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StripeCustomers])],
})
export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);
    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };
    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true,
    };
  }
}
