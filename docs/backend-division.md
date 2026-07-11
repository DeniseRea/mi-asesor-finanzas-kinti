# División del backend: Julio + Leonel

## Fase 1 - Setup conjunto (Horas 0-4)

Hacerlo juntos, uno comparte pantalla:

- Inicializar NestJS
- Configurar Prisma + SQLite
- Implementar el schema de Leonel
- Configurar JWT + Passport
- CORS para el frontend
- docker-compose.yml o Dockerfile para deploy

**Ambos hacen esto juntos porque es la base de todo. Si uno la caga, el otro la pisa.**

---

## Fase 2 - Trabajo paralelo (Horas 4-32)

| Julio | Leonel |
|---|---|
| **RF-01: Auth** | **RF-03: Presupuestos** |
| `POST /auth/register` | `POST /budgets` |
| `POST /auth/login` | `GET /budgets` |
| `POST /auth/google` | `PATCH /budgets/:id` |
| `GET /auth/profile` | `DELETE /budgets/:id` |
| `PATCH /auth/profile` | |
| | |
| **RF-02: Transacciones** | **RF-04: Alertas** |
| `POST /transactions` | `GET /alerts` |
| `GET /transactions` | `PATCH /alerts/:id/read` |
| `GET /transactions/summary` | Lógica: al crear gasto, |
| `POST /transactions/csv` | verificar umbral → alerta |
| `POST /transactions/interpret` | |
| | |
| **Integración LLM** | **RF-05: Soporte** |
| Servicio de interpretación | `POST /tickets` |
| Prompt engineering | `GET /tickets` |
| Manejo de contexto | `GET /tickets/:id` |
| | `POST /knowledge-base` |
| | |
| **Webhooks para n8n** | **Seed data** |
| Endpoint que n8n llama | Script de datos ficticios |
| Formato de respuesta | Usuarios demo |

---

## Por qué esta división

| Razón | Explicación |
|---|---|
| **Julio hace Auth** | Es la base de todo. Si Auth falla, nada funciona. Tú conoces los requisitos a detalle. |
| **Julio hace Transacciones + LLM** | Es lo más complejo (interpretar lenguaje natural). Necesita más contexto de los requisitos. |
| **Leonel hace Presupuestos** | CRUD puro, más straightforward. Ya conoce el schema. |
| **Leonel hace Alertas** | Depende de presupuestos, que ya está haciendo él. |
| **Leonel hace Soporte** | CRUD de tickets + base de conocimiento. Independiente de los otros módulos. |
| **Julio hace webhooks n8n** | Porque él conoce el flujo completo y Denise necesita un endpoint claro. |

---

## Dependencias entre módulos

```
Auth (Julio) ──→ Transacciones (Julio)
    │                    │
    │                    └──→ Alertas (Leonel) ←── Presupuestos (Leonel)
    │
    └──→ Soporte (Leonel)
```

**Auth es el único bloqueante.** Una vez que Julio termine Auth, Leonel puede empezar sus módulos porque todos usan el mismo middleware de JWT.

---

## Fase 3 - Integración (Horas 32-40)

| Tarea | Responsable |
|---|---|
| Probar todos los endpoints juntos | Ambos |
| Integrar con n8n de Denise | Julio |
| Conectar frontend con API | Julio (apiClient) |
| Fix bugs | El que encuentre el problema |
| Seed data final | Leonel |

---

## Fase 4 - Deploy (Horas 40-48)

| Tarea | Responsable |
|---|---|
| Deploy backend en Railway | Julio |
| Variables de entorno | Julio |
| CORS final | Julio |
| Testing E2E completo | Ambos |
| Práctica de demo | Ambos |

---

## Resumen visual

```
Hora 0-4:   Julio + Leonel juntos (setup)
Hora 4-32:  Julio (Auth + Transacciones + LLM + Webhooks)
            Leonel (Presupuestos + Alertas + Soporte + Seed)
Hora 32-40: Julio + Leonel juntos (integración)
Hora 40-48: Julio + Leonel juntos (deploy + demo)
```
