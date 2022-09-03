import { IsEmail, IsString /*Matches*/ } from 'class-validator';

// export const emailRegex: RegExp = /^\w+([\.+]*?\w+[\+]*)@\w+(\w+)(\.\w{2,3})+$/;
export class CreateUserDto {
  //   @Matches(emailRegex, {
  //     message: 'invalid email',
  //   })
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  password: string;
}
