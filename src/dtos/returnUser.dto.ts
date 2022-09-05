import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ReturnUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  profilephoto: string;

  @IsString()
  // @Exclude()
  password: string;

  // constructor(partial: Partial<ReturnUserDto>) {
  //   Object.assign(this, partial);
  // }
}
