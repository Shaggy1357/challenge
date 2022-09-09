import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class AddressBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  Title: string;

  @Column()
  @IsString()
  Address_Line_1: string;

  @Column()
  @IsString()
  Address_Line_2: string;

  @Column()
  @IsString()
  Country: string;

  @Column()
  @IsString()
  State: string;

  @Column()
  @IsString()
  City: string;

  @Column()
  @IsNumber()
  Pincode: number;

  @ManyToOne(() => Users, (user) => user.addresses)
  user: Users;
}
