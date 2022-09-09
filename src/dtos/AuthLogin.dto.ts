import { IsEmail, IsString } from 'class-validator';

export class AuthLogin {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
