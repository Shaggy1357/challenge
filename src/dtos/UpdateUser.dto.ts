import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  profilephoto: string;
}
