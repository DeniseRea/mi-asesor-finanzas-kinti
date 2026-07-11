// Tipos globales compartidos en todo el proyecto

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
