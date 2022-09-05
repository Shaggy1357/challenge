import {
  IsEmail,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export const emailRegex: RegExp = /^\w+([\.+]*?\w+[\+]*)@\w+(\w+)(\.\w{2,3})+$/;
export class CreateUserDto {
  @Matches(emailRegex, {
    message: 'invalid email',
  })
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too WEAK!',
  })
  password: string;
}
