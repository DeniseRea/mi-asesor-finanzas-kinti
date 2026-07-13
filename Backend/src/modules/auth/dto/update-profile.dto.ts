import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsIn(['USD', 'COP', 'EUR'])
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  darkMode?: boolean;

  @IsBoolean()
  @IsOptional()
  budgetAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  movementAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  insightAlerts?: boolean;
}
