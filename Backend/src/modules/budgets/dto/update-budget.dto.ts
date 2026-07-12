import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  month?: number;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  threshold?: number;
}
