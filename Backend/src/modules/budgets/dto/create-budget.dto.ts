import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  threshold?: number;
}
