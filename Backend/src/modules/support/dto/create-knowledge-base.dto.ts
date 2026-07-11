import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateKnowledgeBaseDto {
  @IsString()
  titulo: string;

  @IsString()
  contenido: string;

  @IsString()
  categoria: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
