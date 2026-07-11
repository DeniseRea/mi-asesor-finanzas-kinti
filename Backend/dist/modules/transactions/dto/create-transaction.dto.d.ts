export declare class CreateTransactionDto {
    usuario_id: string;
    accion: 'INGRESO' | 'GASTO';
    monto: number;
    categoria: string;
    entidad?: string;
    fecha?: string;
    descripcion?: string;
}
