import { IsString } from 'class-validator';

export class ChangePassword {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
