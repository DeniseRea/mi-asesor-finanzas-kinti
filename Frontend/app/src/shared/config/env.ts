// Variables de entorno y configuración global
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  appName: 'Mi Asesor Finanzas Kinti',
  appVersion: '1.0.0',
} as const;
