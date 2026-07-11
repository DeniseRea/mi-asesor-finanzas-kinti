export declare class CreateTicketDto {
    usuario_id?: string;
    asunto: string;
    contexto?: string;
}
export declare class CreateTicketMessageDto {
    usuario_id?: string;
    contenido: string;
    rol: 'usuario' | 'agente' | 'humano';
}
