import { IsString, IsOptional } from 'class-validator';

export class ProcesarMensajeDto {
  @IsString()
  usuario_id: string;

  @IsString()
  @IsOptional()
  mensaje?: string;
}
