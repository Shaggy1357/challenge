import { IsNumber, IsString } from 'class-validator';

export class addAddressDto {
  @IsString()
  title: string;

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
