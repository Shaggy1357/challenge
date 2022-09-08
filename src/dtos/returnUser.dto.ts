import { IsEmail, IsString } from 'class-validator';

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
  password: string;
}
