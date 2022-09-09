import { IsNumber, IsString } from 'class-validator';

export class addAddress {
  @IsString()
  Title: string;

  @IsString()
  Address_Line_1: string;

  @IsString()
  Address_Line_2: string;

  @IsString()
  Country: string;

  @IsString()
  State: string;

  @IsString()
  City: string;

  @IsNumber()
  Pincode: number;
}
