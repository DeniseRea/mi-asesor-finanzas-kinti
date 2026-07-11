import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])/, { message: 'Password must include at least one lowercase letter' })
  @Matches(/^(?=.*[A-Z])/, { message: 'Password must include at least one uppercase letter' })
  @Matches(/^(?=.*\d)/, { message: 'Password must include at least one number' })
  @Matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'Password must include at least one symbol' })
  password: string;

  @IsString()
  confirmPassword: string;
}
