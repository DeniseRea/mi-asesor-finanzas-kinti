import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MovimientoDto {
  @IsNumber()
  monto: number;

  @IsString()
  categoria: string;

  @IsString()
  @IsOptional()
  entidad?: string;

  @IsString()
  fecha: string;

  @IsString()
  @IsIn(['GASTO', 'INGRESO', 'INVERSION'])
  tipo: string;
}

export class KintiWebhookDto {
  @IsString()
  @IsOptional()
  request_id?: string;

  @IsString()
  usuario_id: string;

  @IsString()
  origen: string;

  @IsString()
  accion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovimientoDto)
  movimientos: MovimientoDto[];

  @IsString()
  respuesta_chat: string;
}
