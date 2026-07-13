import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @IsString()
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
