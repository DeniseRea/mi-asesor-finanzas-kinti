import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateBudgetDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  monto?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  umbral?: number;
}
