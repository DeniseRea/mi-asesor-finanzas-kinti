# Data Model & Arquitectura

**Proyecto:** Mi Asesor Finanzas Kinti
**Fecha:** Julio 2026
**Versión:** 1.0

---

## 1. Data Model

### Diagrama ER (Mermaid)

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : "registra"
    USER ||--o{ BUDGET : "define"
    USER ||--o{ ALERT : "recibe"
    USER ||--o{ TICKET : "abre"
    BUDGET ||--o{ ALERT : "genera"
    TICKET ||--o{ TICKET_MESSAGE : "contiene"

    USER {
        uuid id PK
        string name
        string email UK
        string password
        string phone
        string currency
        datetime createdAt
        datetime updatedAt
    }

    TRANSACTION {
        uuid id PK
        uuid userId FK
        float amount
        string type
        string category
        string entity
        datetime date
        string description
        boolean confirmed
        datetime createdAt
    }

    BUDGET {
        uuid id PK
        uuid userId FK
        string category
        float amount
        int month
        int year
        float threshold
        datetime createdAt
    }

    ALERT {
        uuid id PK
        uuid userId FK
        uuid budgetId FK
        string type
        string message
        boolean read
        datetime createdAt
    }

    TICKET {
        uuid id PK
        uuid userId FK
        string subject
        string status
        string priority
        string context
        datetime createdAt
    }

    TICKET_MESSAGE {
        uuid id PK
        uuid ticketId FK
        string role
        string content
        datetime createdAt
    }

    KNOWLEDGE_BASE {
        uuid id PK
        string title
        string content
        string category
        boolean active
        datetime updatedAt
    }
```

### Modelos

#### USER
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `name` | String | Nombre del usuario |
| `email` | String | Email único |
| `password` | String | Contraseña hasheada (bcrypt) |
| `phone` | String? | Número de WhatsApp (opcional) |
| `currency` | String | Moneda predeterminada (default: USD) |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Última actualización |

#### TRANSACTION
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | UUID | FK → User |
| `amount` | Float | Monto de la transacción |
| `type` | String | `INGRESO` o `GASTO` |
| `category` | String | Categoría (comida, transporte, salud, etc.) |
| `entity` | String? | Comercio o empresa (opcional) |
| `date` | DateTime | Fecha de la transacción |
| `description` | String? | Descripción adicional (opcional) |
| `confirmed` | Boolean | Si fue confirmada por el usuario |
| `createdAt` | DateTime | Fecha de creación del registro |

#### BUDGET
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | UUID | FK → User |
| `category` | String | Categoría del presupuesto |
| `amount` | Float | Monto límite mensual |
| `month` | Int | Mes (1-12) |
| `year` | Int | Año |
| `threshold` | Float | Umbral de alerta en porcentaje (default: 80) |
| `createdAt` | DateTime | Fecha de creación |

#### ALERT
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | UUID | FK → User |
| `budgetId` | UUID | FK → Budget |
| `type` | String | `umbral_superado`, `exceso_presupuesto`, `insight` |
| `message` | String | Mensaje de la alerta |
| `read` | Boolean | Si fue leída por el usuario |
| `createdAt` | DateTime | Fecha de creación |

#### TICKET
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | UUID | FK → User |
| `subject` | String | Asunto del ticket |
| `status` | String | `abierto`, `en_proceso`, `escaldado`, `resuelto` |
| `priority` | String | `baja`, `media`, `alta`, `critica` |
| `context` | String? | Contexto de la conversación (JSON) |
| `createdAt` | DateTime | Fecha de creación |

#### TICKET_MESSAGE
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `ticketId` | UUID | FK → Ticket |
| `role` | String | `usuario`, `agente`, `humano` |
| `content` | String | Contenido del mensaje |
| `createdAt` | DateTime | Fecha de creación |

#### KNOWLEDGE_BASE
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `title` | String | Título del artículo |
| `content` | String | Contenido de la respuesta |
| `category` | String | Categoría del artículo |
| `active` | Boolean | Si está activo (default: true) |
| `updatedAt` | DateTime | Última actualización |

---

## 2. Arquitectura General

### Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Usuarios"
        U1["👤 Usuario WhatsApp"]
        U2["👤 Usuario Web"]
    end

    subgraph "Canales"
        WA["📱 WhatsApp"]
        WEB["🌐 Frontend Next.js<br/>Puerto 3000"]
    end

    subgraph "Backend"
        BE["⚙️ Backend NestJS<br/>Puerto 3001"]
    end

    subgraph "Automatización"
        N8N["🔄 n8n<br/>Denise"]
        AI["🤖 Proveedor de IA"]
    end

    subgraph "Datos"
        DB[("💾 SQLite / PostgreSQL")]
    end

    U1 -->|"Mensaje"| WA
    U2 -->|"Interacción"| WEB
    WA -->|"Webhook"| N8N
    N8N -->|"Interpretar"| AI
    AI -->|"JSON interpretado"| N8N
    N8N -->|"POST /api/transactions/webhook"| BE
    WEB -->|"API calls"| BE
    BE -->|"CRUD"| DB
    BE -->|"Respuesta"| WEB
    BE -->|"Respuesta"| N8N
    N8N -->|"Respuesta"| WA
```

### Responsabilidades

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| **Frontend** | Next.js 16 + React 19 + Tailwind 4 | Interfaz web: login, dashboard, transacciones, presupuestos, alertas, soporte |
| **Backend** | NestJS 11 + Prisma 5 + SQLite | API REST: auth, transacciones, presupuestos, alertas, tickets |
| **n8n** | n8n (Denise) | Automatización: recibir WhatsApp, interpretar con IA, enviar al backend |
| **AI Provider** | Configurado en n8n | Interpretar mensajes en lenguaje natural a JSON estructurado |
| **WhatsApp** | API de WhatsApp Business | Canal de comunicación del usuario |
| **DB** | SQLite (dev) / PostgreSQL (prod) | Almacenamiento persistente de datos |

---

## 3. Arquitectura Backend

### Diagrama de Módulos

```mermaid
graph TB
    subgraph "Backend NestJS"
        APP["AppModule"]

        subgraph "Módulos"
            AUTH["🔐 AuthModule"]
            TX["💳 TransactionsModule"]
            BUD["📊 BudgetsModule"]
            ALERT["🔔 AlertsModule"]
            SUPPORT["🎧 SupportModule"]
        end

        subgraph "Shared"
            PRISMA["🗄️ PrismaModule<br/>(Global)"]
            JWT["🎫 JwtModule<br/>(Global)"]
        end
    end

    DB[("💾 Database")]

    APP --> AUTH
    APP --> TX
    APP --> BUD
    APP --> ALERT
    APP --> SUPPORT

    AUTH --> PRISMA
    AUTH --> JWT
    TX --> PRISMA
    BUD --> PRISMA
    ALERT --> PRISMA
    SUPPORT --> PRISMA

    PRISMA --> DB
```

### Estado de Implementación

| Módulo | Estado | Endpoints |
|---|---|---|
| **AuthModule** | ✅ Implementado | POST register, POST login, GET/PATCH profile |
| **TransactionsModule** | ✅ Implementado | POST webhook, POST/GET/DELETE, GET summary, POST csv |
| **BudgetsModule** | ✅ Implementado | POST webhook, POST/GET/PATCH/DELETE, GET status |
| **AlertsModule** | ✅ Implementado | GET alerts, GET unread-count, PATCH read, DELETE |
| **SupportModule** | ✅ Implementado | POST/GET/DELETE tickets, POST messages, PATCH status, POST/GET/DELETE knowledge-base |

### Dependencias entre Módulos

```mermaid
graph LR
    AUTH["🔐 Auth"] -->|"JWT guard"| TX["💳 Transactions"]
    AUTH -->|"JWT guard"| BUD["📊 Budgets"]
    AUTH -->|"JWT guard"| ALERT["🔔 Alerts"]
    AUTH -->|"JWT guard"| SUPPORT["🎧 Support"]
    TX -->|"al crear gasto"| ALERT
    BUD -->|"al verificar umbral"| ALERT
```

---

## 4. Arquitectura Frontend

### Diagrama FSD (Feature-Sliced Design)

```mermaid
graph TB
    subgraph "app/ [Routing]"
        APP_LAYOUT["layout.tsx<br/>Root Layout"]
        APP_HOME["page.tsx<br/>Home"]
        APP_DASH["dashboard/page.tsx<br/>Dashboard"]
    end

    subgraph "pageviews/ [Pages]"
        PV_HOME["Home.tsx"]
        PV_DASH["Dashboard.tsx"]
    end

    subgraph "widgets/ [Blocks]"
        W_SIDEBAR["Sidebar<br/>Nav + User + Lang"]
    end

    subgraph "features/ [Actions]"
        F_AUTH["auth/<br/>LoginForm + API"]
    end

    subgraph "entities/ [Business]"
        E_USER["user/<br/>Types + UserAvatar"]
    end

    subgraph "shared/ [Reusable]"
        S_BTN["Button"]
        S_API["apiClient"]
        S_I18N["i18n (ES/EN)"]
    end

    APP_HOME --> PV_HOME
    APP_DASH --> PV_DASH
    APP_LAYOUT --> W_SIDEBAR
    PV_HOME --> F_AUTH
    PV_DASH --> E_USER
    F_AUTH --> S_API
    PV_DASH --> S_BTN
    W_SIDEBAR --> E_USER
    W_SIDEBAR --> S_I18N
    APP_HOME --> S_I18N
```

### Páginas Existentes

| Ruta | Componente | Estado |
|---|---|---|
| `/{locale}/` | Home (Hero) | ✅ Implementado (mock) |
| `/{locale}/dashboard` | Dashboard (Stats + Chart) | ✅ Implementado (mock) |
| `/{locale}/login` | Login | ⏳ LoginForm existe pero no montado |
| `/{locale}/transactions` | Transacciones | ❌ No implementado |
| `/{locale}/budgets` | Presupuestos | ❌ No implementado |
| `/{locale}/alerts` | Alertas | ❌ No implementado |

---

## 5. Flujo de Datos

### Flujo 1: Registro de gasto por WhatsApp

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant WA as 📱 WhatsApp
    participant N8N as 🔄 n8n
    participant AI as 🤖 AI Provider
    participant BE as ⚙️ Backend
    participant DB as 💾 DB

    U->>WA: "gasté 25 dólares en comida"
    WA->>N8N: Webhook con mensaje
    N8N->>N8N: Resolver usuario_id por teléfono
    N8N->>AI: Enviar mensaje para interpretar
    AI-->>N8N: JSON: {accion: "GASTO", monto: 25, categoria: "comida"}
    N8N->>U: "¿Confirmás gasto de $25 en comida?"
    U->>WA: "Sí, confirmo"
    WA->>N8N: Confirmación
    N8N->>BE: POST /api/transactions/webhook
    BE->>DB: INSERT transaction
    DB-->>BE: Transacción creada
    BE-->>N8N: {id, monto, categoria, ...}
    N8N->>WA: "✅ Gasto registrado. Saldo: $2,475"
    WA-->>U: Respuesta
```

### Flujo 2: Registro de gasto por Web

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant FE as 🌐 Frontend
    participant BE as ⚙️ Backend
    participant DB as 💾 DB

    U->>FE: Escribe "gasté 25 en comida"
    FE->>N8N: POST mensaje (mismo flujo que WhatsApp)
    N8N-->>FE: JSON interpretado
    FE->>U: Muestra: "¿Confirmás gasto de $25 en comida?"
    U->>FE: Click "Confirmar"
    FE->>BE: POST /api/transactions
    BE->>DB: INSERT transaction
    DB-->>BE: Transacción creada
    BE-->>FE: {id, monto, categoria, ...}
    FE->>U: Muestra resumen actualizado
```

### Flujo 3: Alerta de presupuesto

```mermaid
sequenceDiagram
    participant FE as 🌐 Frontend
    participant BE as ⚙️ Backend
    participant DB as 💾 DB
    participant N8N as 🔄 n8n
    participant WA as 📱 WhatsApp

    FE->>BE: POST /api/transactions (nuevo gasto)
    BE->>DB: INSERT transaction
    BE->>DB: SELECT SUM(gastos) WHERE category = X
    BE->>DB: SELECT budget WHERE category = X
    alt Gasto > umbral
        BE->>DB: INSERT alert
        BE-->>N8N: Notificar alerta
        N8N->>WA: "⚠️ Alerta: Superaste el 80% de tu presupuesto de comida"
    end
    BE-->>FE: Transacción creada
```

### Flujo 4: Soporte y escalamiento

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant N8N as 🔄 n8n
    participant AI as 🤖 AI Provider
    participant BE as ⚙️ Backend
    participant DB as 💾 DB
    participant H as 👨‍💼 Humano

    U->>N8N: "Quiero reclamar una transacción"
    N8N->>AI: Interpretar intención
    AI-->>N8N: {intencion: "reclamo", sensible: true}
    N8N->>BE: POST /api/tickets
    BE->>DB: INSERT ticket + messages
    BE-->>N8N: Ticket creado
    N8N->>H: Notificación de ticket
    N8N->>U: "Ticket #123 creado. Un agente te contactará."
```

---

## 6. API Endpoints

### Auth (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | No | Registro de usuario |
| `POST` | `/auth/login` | No | Inicio de sesión |
| `GET` | `/auth/profile` | JWT | Obtener perfil |
| `PATCH` | `/auth/profile` | JWT | Actualizar phone/currency |

### Transactions (`/api/transactions`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/transactions/webhook` | No | Recibe JSON de n8n |
| `POST` | `/transactions` | JWT | Crear transacción manual |
| `GET` | `/transactions` | JWT | Listar transacciones (filtros: type, category, from, to) |
| `GET` | `/transactions/summary` | JWT | Resumen mensual (ingresos, gastos, saldo) |
| `POST` | `/transactions/csv` | No | Parsear CSV (vista previa) |
| `POST` | `/transactions/csv/confirm` | JWT | Confirmar importación CSV |
| `DELETE` | `/transactions/:id` | JWT | Eliminar transacción |

### Budgets (`/api/budgets`) - Pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/budgets/webhook` | No | Recibe JSON de n8n |
| `POST` | `/budgets` | JWT | Crear presupuesto |
| `GET` | `/budgets` | JWT | Listar presupuestos |
| `GET` | `/budgets/status` | No | Consultar estado por categoría |
| `PATCH` | `/budgets/:id` | JWT | Editar presupuesto |
| `DELETE` | `/budgets/:id` | JWT | Eliminar presupuesto |

### Alerts (`/api/alerts`) - Pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/alerts` | JWT | Listar alertas |
| `PATCH` | `/alerts/:id/read` | JWT | Marcar como leída |

### Support (`/api/tickets`) - Pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/tickets` | No | Crear ticket |
| `GET` | `/tickets` | JWT | Listar tickets |
| `GET` | `/tickets/:id` | JWT | Detalle con historial |
| `POST` | `/knowledge-base` | JWT | Cargar base de conocimiento |

---

## 7. Variables de Entorno

| Variable | Desarrollo | Producción | Descripción |
|---|---|---|---|
| `DATABASE_URL` | `postgresql://kinti:kinti123@localhost:5432/kinti_dev` | `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME` | URL de conexión a la DB |
| `JWT_SECRET` | `kinti-dev-secret-key-hackathon` | `YOUR_PRODUCTION_SECRET_HERE` | Clave para firmar JWTs |
| `PORT` | `3001` | `3001` | Puerto del backend |

### Archivo de entorno

- `.env` en la raíz es la única fuente local para backend, frontend y Docker Compose; permanece ignorado por Git.
- `.env.example` documenta todas las claves sin incluir secretos.
- En Railway se configuran las mismas claves directamente como variables del servicio.

### Nota sobre SQLite (eliminado)

Antes se usaba SQLite para dev. Ahora ambasdb PostgreSQL:
- Dev: PostgreSQL via docker-compose
- Prod: PostgreSQL en Railway

---

## 8. Deployment

### Archivos Docker

| Archivo | Uso |
|---|---|
| `Dockerfile.dev` | Desarrollo: prisma migrate + hot reload |
| `Dockerfile.prod` | Producción: multi-stage build optimizado |
| `docker-compose.dev.yml` | PostgreSQL + Backend local |

### Comandos

```bash
# Desarrollo local
docker compose -f docker-compose.dev.yml up

# Build producción
docker build -f Dockerfile.prod -t kinti-backend .

# Producción (Railway)
# Railway detecta automáticamente el Dockerfile.prod
```

### Diagrama de Despliegue

```mermaid
graph TB
    subgraph "Producción"
        VERCEL["▲ Vercel<br/>Frontend Next.js<br/>Puerto 3000"]
        RAILWAY["🚂 Railway<br/>Backend NestJS<br/>Puerto 3001"]
        N8N_CLOUD["☁️ n8n Cloud<br/>Automatización"]
        WA_API["📱 WhatsApp Business API"]
        PG[("🐘 PostgreSQL<br/>Railway")]
    end

    subgraph "Desarrollo"
        LOCAL_FE["💻 localhost:3000"]
        LOCAL_BE["💻 localhost:3001"]
        LOCAL_N8N["💻 localhost:5678"]
        PG_DOCKER[("🐘 PostgreSQL<br/>Docker :5432")]
    end

    VERCEL -->|"API calls"| RAILWAY
    N8N_CLOUD -->|"webhooks"| RAILWAY
    WA_API -->|"mensajes"| N8N_CLOUD
    RAILWAY -->|"queries"| PG

    LOCAL_FE --> LOCAL_BE
    LOCAL_N8N --> LOCAL_BE
    LOCAL_BE --> PG_DOCKER
```
