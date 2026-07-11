import { IsString, IsOptional, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @IsString()
  asunto: string;

  @IsString()
  @IsOptional()
  contexto?: string;
}

export class CreateTicketMessageDto {
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @IsString()
  contenido: string;

  @IsIn(['usuario', 'agente', 'humano'])
  rol: 'usuario' | 'agente' | 'humano';
}
