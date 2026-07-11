import { IsString, IsNumber, IsOptional, IsIn, IsDateString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  usuario_id: string;

  @IsIn(['INGRESO', 'GASTO'])
  accion: 'INGRESO' | 'GASTO';

  @IsNumber()
  @Min(0.01)
  monto: number;

  @IsString()
  categoria: string;

  @IsString()
  @IsOptional()
  entidad?: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
