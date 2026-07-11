# Guía de Levantamiento

## Desarrollo Local

### Prerrequisitos
- Docker Desktop instalado y corriendo
- Node.js 20+ instalado

### Levantar Backend + PostgreSQL

```bash
cd Backend
docker compose -f docker-compose.dev.yml up
```

Esto levanta:
- PostgreSQL en `localhost:5432`
- Backend en `localhost:3001` con hot reload

### Primera vez (migrar base de datos)

```bash
# En otra terminal, dentro de Backend/
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev --name init
```

### Levantar Frontend

```bash
cd Frontend/app
npm run dev
```

Frontend en `localhost:3000`

### Verificar que funciona

```bash
# Backend health check
curl http://localhost:3001/api/auth/profile
# Debería retornar 401 (Unauthorized) - significa que el backend está corriendo

# Registrar usuario de prueba
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### Comandos útiles

```bash
# Ver logs del backend
docker compose -f docker-compose.dev.yml logs -f backend

# Ver logs de PostgreSQL
docker compose -f docker-compose.dev.yml logs -f postgres

# Parar todo
docker compose -f docker-compose.dev.yml down

# Parar y borrar datos
docker compose -f docker-compose.dev.yml down -v

# Reconstruir después de cambiar Dockerfile
docker compose -f docker-compose.dev.yml up --build

# Abrir psql directo
docker compose -f docker-compose.dev.yml exec postgres psql -U kinti -d kinti_dev
```

## Producción (Railway)

### Build
```bash
docker build -f Dockerfile.prod -t kinti-backend .
```

### Variables de entorno en Railway
Copiar el contenido de `.env.prod` y reemplazar los placeholders:
- `DATABASE_URL` → Railway provee la URL de PostgreSQL
- `JWT_SECRET` → Generar un secreto fuerte

### Deploy
Railway detecta automáticamente el `Dockerfile.prod` y ejecuta:
1. `npm ci` (instalar dependencias)
2. `prisma generate` (generar cliente)
3. `npm run build` (compilar TypeScript)
4. `prisma migrate deploy` (aplicar migraciones)
5. `node dist/main.js` (iniciar servidor)
