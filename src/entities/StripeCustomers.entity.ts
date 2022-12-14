import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StripeCustomers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  receiptURL: string;
}
