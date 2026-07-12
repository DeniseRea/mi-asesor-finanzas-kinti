# Guía de Arquitectura y Pruebas: Integración n8n (Kinti)

Este documento detalla cómo funciona la conexión entre el Backend de Kinti y el motor de IA (n8n) a través de webhooks asíncronos, y cómo probar este flujo en distintos entornos sin usar túneles públicos inestables.

---

## 1. El Flujo de Vida (Workflow)

La arquitectura de Kinti está diseñada bajo el **Patrón Callback / Webhook**, lo que significa que el código nunca cambia al migrar de Desarrollo a Producción. 

1. **Ida:** Frontend -> `POST /api/kinti/procesar` -> Backend reenvía a `[URL_N8N_WEBHOOK]` (no espera respuesta).
2. **Proceso IA:** n8n analiza el texto o archivo (toma 2 a 5 segundos).
3. **Regreso:** n8n envía un `POST` (Callback) hacia `[URL_BACKEND]/api/kinti-webhook` con la data estructurada.
4. **Almacenamiento:** El Backend guarda todo de golpe en PostgreSQL (`kinti_dev`).
5. **Notificación:** El Frontend, que estaba haciendo *polling*, detecta que el proceso terminó y se actualiza la interfaz.

---

## 2. Entorno de Desarrollo Local (La forma recomendada)

Para evitar problemas de red, firewalls de Windows (WSL) y túneles (Localtunnel/Ngrok) que se caen, la mejor forma de desarrollar es **tener todo local**.

### Paso A: Levantar Base de Datos y Backend
En la terminal de la carpeta `Backend/`:
```bash
# Levantar PostgreSQL (Cambiamos el puerto a 5433 en docker-compose si 5432 falla)
docker-compose -f docker-compose.dev.yml up -d postgres

# Sincronizar esquemas
npx prisma db push

# Iniciar servidor en http://localhost:3001
npm run start:dev
```

### Paso B: Levantar n8n Localmente
En una nueva terminal, levanta n8n sin instalar nada permanentemente:
```bash
npx n8n
```
Esto abrirá tu n8n en `http://localhost:5678`.

### Paso C: Conectar Ambos Mundos (Solo Local)
- Si ya tenías tu flujo de n8n en la nube, expórtalo (`.json`) y **súbelo a tu n8n local**.
- En el nodo **HTTP Request** final de tu n8n local, pon como destino a tu Backend:
  - **URL:** `http://localhost:3001/api/kinti-webhook`
  - **Headers:** `x-kinti-secret: kinti-secret-12345`

¡Listo! Con esto el Frontend, el Backend y n8n viven en tu misma computadora y se comunicarán en milisegundos de forma 100% fiable.

---

## 3. Entorno de Producción (Migración a la Nube)

Cuando Kinti esté listo para salir al mundo, solo hay que cambiar URLs, la arquitectura es la misma:

1. **Desplegar Backend:** Subes el código de tu carpeta `Backend/` a un servicio en la nube (ej. Railway, Render, AWS). Te darán una URL como `https://api.kinti.com`.
2. **Volver a n8n Cloud:** Vas a tu n8n oficial (`deni-rea.app.n8n.cloud`), importas tu flujo finalizado, y cambias la URL del nodo HTTP Request:
   - **URL Nueva:** `https://api.kinti.com/api/kinti-webhook`
3. **Variables de Entorno:** En el `.env` de tu servidor en la nube, colocas el webhook de n8n cloud en `N8N_WEBHOOK_URL`.

Ninguna línea del código de NestJS o React requiere ser modificada.

---

## 4. (Opcional) Simular el Callback Manualmente
Si en desarrollo necesitas probar que el backend recibe datos sin abrir n8n, puedes correr el script de prueba integrado:

```bash
# Dentro de la carpeta Backend/
node test-webhook.js
```
Esto simula a la perfección el POST que n8n enviaría, registrando datos de prueba directamente en tu base local.
