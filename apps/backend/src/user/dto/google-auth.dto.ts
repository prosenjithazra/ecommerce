import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid Google email address' })
  email?: string;

  @IsOptional()
  @IsString()
  credential?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
