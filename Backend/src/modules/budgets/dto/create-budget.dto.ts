import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @IsString()
  categoria: string;

  @IsNumber()
  @Min(0.01)
  monto: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  mes: number;

  @IsNumber()
  @Min(2020)
  @Max(2030)
  anio: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  umbral?: number;
}
