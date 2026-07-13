import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail()
  email: string;
}

export class VerifyPasswordResetDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  resetToken: string;

  @IsString()
  @MinLength(8)
  @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\p{L}\p{N}\s]).+$/u,
  )
  password: string;

  @IsString()
  confirmPassword: string;
}
