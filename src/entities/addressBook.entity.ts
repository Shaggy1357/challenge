import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @IsString()
  Pincode: number;
}
