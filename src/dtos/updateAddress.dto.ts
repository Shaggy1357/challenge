import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddress {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  Title: string;

  @IsString()
  @IsOptional()
  Address_Line_1: string;

  @IsString()
  @IsOptional()
  Address_Line_2: string;

  @IsString()
  @IsOptional()
  Country: string;

  @IsString()
  @IsOptional()
  State: string;

  @IsString()
  @IsOptional()
  City: string;

  @IsNumber()
  @IsOptional()
  Pincode: number;
}
