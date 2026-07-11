# Requisitos Funcionales v1.2

**Proyecto:** Hackathon de Agentes Financieros IA - Track 2
**Fecha:** Julio 2026
**Estado:** Borrador - Pendiente de definición en equipo

### Changelog v1.2

- RF-02 y RF-03 actualizados para clarificar responsabilidades entre n8n (Denise) y backend.
- Se eliminaron flujos de interpretación de lenguaje natural del backend (los maneja n8n).
- Se agregaron endpoints `/webhook` para que n8n envíe JSON interpretado al backend.
- Se renumeraron los pendientes (P-5 a P-19).

---

## Convenciones

- Cada RF incluye: Descripción, Precondiciones, Flujos y Criterios de aceptación.
- Los ítems marcados como **[PENDIENTE-N]** son decisiones que aún no se han tomado en equipo.
- Este documento es coherente con las historias de usuario definidas en `hackathon-instructions.md`.

---

## RF-01 - Inicio de sesión

### Descripción

El usuario puede crear una cuenta, iniciar sesión y completar su perfil para acceder a las funcionalidades financieras de la aplicación.

### Precondiciones

- No estar autenticado para registrarse o iniciar sesión.

### Flujos

#### Flujo 1: Registro con email/usuario

1. El usuario ingresa: nombre de usuario, email, contraseña y confirmación de contraseña.
2. El sistema valida los datos.
3. Se crea la cuenta y se inicia sesión automáticamente.
4. Se redirige al completar perfil (ver Flujo 3).

#### Flujo 2: Registro/Login con Google OAuth

1. El usuario selecciona "Continuar con Google".
2. Se redirige al flujo OAuth de Google.
3. Al completar, el sistema verifica si el usuario ya existe.
4. Si es nuevo: solicita creación de nombre de usuario.
5. Se crea la cuenta y se inicia sesión.
6. Se redirige al completar perfil (ver Flujo 3).

#### Flujo 3: Login con email/usuario y contraseña

1. El usuario ingresa email/nombre de usuario y contraseña.
2. El sistema valida las credenciales.
3. Se inicia sesión y se redirige al dashboard.

#### Flujo 4: Completar perfil post-registro

1. Se muestra un formulario con campos opcionales:
    - **Celular:** número de WhatsApp (para vincular el bot).
    - **Moneda:** moneda predeterminada para mostrar en el front (USD, EUR, CLP, etc.).
2. El usuario puede saltar este paso y completarlo después.

### Criterios de aceptación

- [ ] El registro con email/usuario crea una cuenta válida.
- [ ] El registro con Google OAuth funciona y solicita nombre de usuario.
- [ ] El login con credenciales funciona correctamente.
- [ ] El login con Google funciona para usuarios existentes.
- [ ] El perfil post-registro permite guardar celular y moneda.
- [ ] La contraseña cumple con los requisitos mínimos de seguridad.

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-1 | ¿Se requiere verificación de email? | Sí / No |
| P-2 | ¿Requisitos de contraseña? | Mín. 8 chars + número / Solo 8 chars / Libre |
| P-3 | ¿Se permite eliminar cuenta? | Sí / No |
| P-4 | ¿OAuth solo Google o también otros proveedores? | Solo Google / + Facebook / + GitHub |

---

## RF-02 - Registro de transacciones

### Descripción

El usuario puede registrar ingresos y gastos mediante lenguaje natural por WhatsApp o por la app web. La interpretación del mensaje la realiza **n8n (Denise)** usando un proveedor de IA. El **backend** solo recibe el JSON ya interpretado y lo guarda en la base de datos.

### Responsabilidades

| Componente | Responsabilidad |
|---|---|
| **n8n (Denise)** | Recibe mensaje de WhatsApp, resuelve usuario por teléfono, llama al proveedor de IA, interpreta el mensaje, muestra confirmación al usuario, envía JSON al backend |
| **Backend (Julio)** | Recibe JSON interpretado de n8n, guarda transacciones, lista transacciones, genera resumen de ingresos/gastos/saldo, maneja importación CSV |

### Precondiciones

- El usuario debe estar registrado y haber iniciado sesión.
- Si usa WhatsApp, debe haber registrado su número de celular en el perfil.

### Flujos

#### Flujo 1: Registro por WhatsApp (n8n → Backend)

1. El usuario envía un mensaje en lenguaje natural, ej: "gasté 25 dólares en comida".
2. **n8n** recibe el mensaje y resuelve el `usuario_id` por número de teléfono.
3. **n8n** envía el mensaje al proveedor de IA.
4. El proveedor de IA interpreta y retorna un JSON con:
    - **Acción:** INGRESO o GASTO
    - **Monto:** numérico
    - **Categoría:** comida, transporte, salud, etc.
    - **Entidad/Comercio:** opcional
    - **Fecha:** si no se menciona, usa la fecha actual.
5. **n8n** muestra al usuario los datos interpretados y pide confirmación.
6. El usuario confirma o corrige.
7. **n8n** envía `POST /api/transactions/webhook` al backend con el JSON confirmado.
8. **Backend** guarda la transacción y retorna confirmación.
9. **n8n** responde al usuario con un resumen actualizado (ingresos, gastos, saldo).

**JSON que n8n envía al backend:**

```json
{
  "usuario_id": "uuid-del-usuario",
  "accion": "GASTO",
  "monto": 25.00,
  "categoria": "comida",
  "entidad": "restaurante",
  "fecha": "2026-07-11"
}
```

**Respuesta del backend:**

```json
{
  "id": "uuid-transaccion",
  "usuario_id": "uuid-del-usuario",
  "accion": "GASTO",
  "monto": 25.00,
  "categoria": "comida",
  "entidad": "restaurante",
  "fecha": "2026-07-11",
  "confirmado": true,
  "created_at": "2026-07-11T15:30:00Z"
}
```

#### Flujo 2: Registro por la app web

1. El usuario escribe un mensaje en el chat de la app web.
2. El frontend envía el mensaje a **n8n** (mismo flujo que WhatsApp).
3. **n8n** interpreta, retorna JSON, el usuario confirma.
4. **n8n** envía el JSON al backend (`POST /api/transactions/webhook`).
5. **Backend** guarda y retorna confirmación.

#### Flujo 3: Registro manual por la app web (sin n8n)

1. El usuario completa un formulario manual (monto, categoría, fecha, etc.).
2. El frontend envía `POST /api/transactions` directamente al backend.
3. **Backend** guarda y retorna confirmación.

**JSON que el frontend envía al backend:**

```json
{
  "usuario_id": "uuid-del-usuario",
  "accion": "GASTO",
  "monto": 50.00,
  "categoria": "Acciones",
  "entidad": "Apple",
  "fecha": "2026-07-11"
}
```

#### Flujo 4: Resumen de transacciones

1. El frontend o n8n solicitan `GET /api/transactions/summary?usuario_id=xxx`.
2. **Backend** retorna:

```json
{
  "usuario_id": "uuid-del-usuario",
  "moneda": "USD",
  "total_ingresos": 3500.00,
  "total_gastos": 1250.00,
  "saldo": 2250.00,
  "periodo": {
    "mes": 7,
    "anio": 2026
  }
}
```

#### Flujo 5: Importación CSV (solo app web)

1. El usuario sube un archivo CSV desde la app web.
2. El frontend envía el CSV a `POST /api/transactions/csv`.
3. **Backend** parsea, valida y retorna vista previa.
4. El usuario confirma.
5. **Backend** guarda todas las transacciones validadas.

#### Flujo 6: Validación de usuario por WhatsApp (n8n)

1. Un número desconocido envía un mensaje al bot.
2. **n8n** responde indicando que no tiene registro del número y muestra un link de registro.
3. El usuario se registra en la app web y vincula su número.
4. A partir de ahí, **n8n** reconoce al usuario por su teléfono.

> **Nota:** Este flujo lo maneja completamente n8n. El backend no participa.

### Endpoints del backend

| Método | Ruta | Descripción | Origen |
|---|---|---|---|
| `POST` | `/api/transactions/webhook` | Recibe JSON de n8n y guarda transacción | n8n |
| `POST` | `/api/transactions` | Crear transacción manual (formulario web) | Frontend |
| `GET` | `/api/transactions` | Listar transacciones del usuario | Frontend |
| `GET` | `/api/transactions/summary` | Resumen ingresos/gastos/saldo | Frontend / n8n |
| `POST` | `/api/transactions/csv` | Importar CSV (vista previa) | Frontend |
| `POST` | `/api/transactions/csv/confirm` | Confirmar importación CSV | Frontend |
| `DELETE` | `/api/transactions/:id` | Eliminar transacción | Frontend |

### Criterios de aceptación

- [ ] n8n puede enviar transacciones al backend vía `POST /api/transactions/webhook`.
- [ ] El frontend puede crear transacciones manuales vía `POST /api/transactions`.
- [ ] Se guardan transacciones de tipo INGRESO y GASTO.
- [ ] El resumen de ingresos/gastos/saldo se calcula correctamente.
- [ ] La importación CSV muestra vista previa antes de confirmar.
- [ ] Se pueden listar transacciones con filtros (tipo, categoría, fecha).

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-5 | ¿Formato exacto del CSV bancario? | Estándar del banco / Formato propio a definir |
| P-6 | ¿Límite de transacciones por CSV? | Sin límite / Máx 100 / Máx 500 |
| P-7 | ¿Qué pasa si el CSV tiene filas con errores? | Saltar filas erróneas / Rechazar todo / Mostrar resumen de errores |
| P-8 | ¿Categorías predefinidas o el usuario crea las suyas? | Lista fija / Usuario crea / Mixto |

---

## RF-03 - Registro de presupuestos y configuración de umbrales

### Descripción

El usuario puede definir presupuestos mensuales por categoría y configurar umbrales para recibir alertas cuando se acerque o supere el límite. La interpretación de mensajes por WhatsApp la realiza **n8n (Denise)**. El **backend** recibe el JSON ya interpretado.

### Responsabilidades

| Componente | Responsabilidad |
|---|---|
| **n8n (Denise)** | Recibe mensaje de WhatsApp, interpreta intención de crear/consultar presupuesto, muestra confirmación, envía JSON al backend |
| **Backend (Julio/Leonel)** | Recibe JSON de n8n, guarda presupuestos, calcula gasto mensual por categoría, retorna estado del presupuesto |

### Precondiciones

- El usuario debe estar registrado y haber iniciado sesión.
- Debe existir al menos una categoría de gasto definida.

### Flujos

#### Flujo 1: Crear presupuesto por WhatsApp (n8n → Backend)

1. El usuario envía un mensaje como: "presupuesto comida 500" o "límite mensual comida $500".
2. **n8n** interpreta: categoría = comida, monto = 500.
3. **n8n** muestra al usuario: "Entendido, tu presupuesto de comida es $500/mes. ¿Correcto?"
4. El usuario confirma o corrige.
5. **n8n** envía `POST /api/budgets/webhook` al backend.
6. **Backend** guarda el presupuesto y retorna confirmación.

**JSON que n8n envía al backend:**

```json
{
  "usuario_id": "uuid-del-usuario",
  "categoria": "comida",
  "monto": 500.00,
  "mes": 7,
  "anio": 2026,
  "umbral": 80
}
```

#### Flujo 2: Crear presupuesto por la app web

1. El usuario navega a la sección de presupuestos.
2. Selecciona una categoría, ingresa el monto mensual y configura el umbral.
3. El frontend envía `POST /api/budgets` al backend.
4. **Backend** guarda y retorna confirmación.

#### Flujo 3: Consultar presupuesto por WhatsApp (n8n → Backend)

1. El usuario pregunta: "¿Cuánto me queda de comida este mes?"
2. **n8n** envía `GET /api/budgets/status?usuario_id=xxx&categoria=comida` al backend.
3. **Backend** calcula el gasto mensual en esa categoría y retorna:

```json
{
  "categoria": "comida",
  "presupuesto": 500.00,
  "gastado": 320.00,
  "restante": 180.00,
  "porcentaje_usado": 64,
  "umbral": 80,
  "alerta": false
}
```

4. **n8n** formatea la respuesta y la envía al usuario por WhatsApp.

#### Flujo 4: Listar presupuestos (app web)

1. El frontend solicita `GET /api/budgets?usuario_id=xxx`.
2. **Backend** retorna la lista de presupuestos del usuario con su estado actual.

### Endpoints del backend

| Método | Ruta | Descripción | Origen |
|---|---|---|---|
| `POST` | `/api/budgets/webhook` | Recibe JSON de n8n y guarda presupuesto | n8n |
| `POST` | `/api/budgets` | Crear presupuesto manual (formulario web) | Frontend |
| `GET` | `/api/budgets` | Listar presupuestos del usuario | Frontend |
| `GET` | `/api/budgets/status` | Consultar estado de presupuesto por categoría | n8n / Frontend |
| `PATCH` | `/api/budgets/:id` | Editar presupuesto | Frontend |
| `DELETE` | `/api/budgets/:id` | Eliminar presupuesto | Frontend |

### Criterios de aceptación

- [ ] n8n puede enviar presupuestos al backend vía `POST /api/budgets/webhook`.
- [ ] El frontend puede crear/editar/eliminar presupuestos.
- [ ] El presupuesto requiere: categoría y monto mensual.
- [ ] El gasto mensual por categoría se calcula sumando los gastos de esa categoría en el mes.
- [ ] Se puede consultar el estado del presupuesto (gastado, restante, porcentaje).

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-9 | ¿El umbral se define en porcentaje o valor fijo? | Porcentaje (ej: 80%) / Valor fijo (ej: $400) / Ambos |
| P-10 | ¿Se pueden editar presupuestos existentes? | Sí / No (solo crear uno nuevo) |
| P-11 | ¿Se pueden eliminar presupuestos? | Sí / No |
| P-12 | ¿Un usuario puede tener varios presupuestos por categoría? | No (uno por categoría) / Sí (ej: comida normal + comida restaurantes) |

---

## RF-04 - Alertas

### Descripción

Cuando el gasto mensual en una categoría se acerca o supera el umbral configurado, el sistema envía una alerta al usuario mostrando los valores relevantes: lo gastado, el presupuesto definido y el umbral.

### Precondiciones

- El usuario debe tener al menos un presupuesto registrado con un umbral configurado.

### Flujos

#### Flujo 1: Alerta por superación de umbral

1. Se detecta que los gastos mensuales de una categoría superaron el umbral.
2. Se genera una alerta con los datos:
    - Categoría
    - Monto gastado
    - Presupuesto definido
    - Umbral configurado
    - Porcentaje utilizado
3. Se envía la alerta por el canal configurado.

#### Flujo 2: Alerta por exceso de presupuesto

1. Se detecta que los gastos mensuales de una categoría superaron el 100% del presupuesto.
2. Se genera una alerta de exceso con los mismos datos.
3. Se envía por el canal configurado.

### Criterios de aceptación

- [ ] Se genera alerta al superar el umbral configurado.
- [ ] Se genera alerta al exceder el 100% del presupuesto.
- [ ] La alerta muestra: categoría, gastado, presupuesto y umbral.
- [ ] La alerta se explica con datos del usuario, sin recomendaciones de inversión personalizadas.

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-14 | ¿Canal de envío de alertas? | WhatsApp / Notificación en la app / Ambos |
| P-15 | ¿Las alertas se envían en tiempo real o en resumen diario/semanal? | Tiempo real / Resumen diario / Resumen semanal |
| P-16 | ¿El usuario puede desactivar alertas por categoría? | Sí / No |

---

## RF-05 - Soporte financiero 24/7 con escalamiento

### Descripción

Un asistente financiero responde consultas del cliente sobre su cuenta, procesos o documentos desde una base de conocimiento aprobada. Detecta consultas sensibles, reclamos o solicitudes regulatorias y las deriva a un humano, creando un ticket con historial y prioridad.

### Precondiciones

- El usuario debe estar registrado.
- Debe existir una base de conocimiento cargada con información aprobada.

### Flujos

#### Flujo 1: Consulta estándar

1. El usuario envía una consulta, ej: "¿Cómo cambio mi contraseña?"
2. El asistente busca en la base de conocimiento.
3. Responde con la información relevante.

#### Flujo 2: Detección de consulta sensible

1. El usuario envía una consulta sensible, ej: "Quiero reclamar una transacción no reconocida".
2. El asistente detecta que es un reclamo/solicitud regulatoria.
3. Responde confirmando que derivará la consulta a un agente humano.
4. Crea un ticket con:
    - Historial de la conversación
    - Contexto de la consulta
    - Prioridad (calculada o asignada)
5. Notifica al equipo humano.

#### Flujo 3: Escalamiento a humano

1. El usuario solicita hablar con un humano, ej: "Habla con una persona".
2. El asistente confirma el escalamiento.
3. Crea el ticket y notifica al equipo.

### Criterios de aceptación

- [ ] El asistente responde desde una base de conocimiento aprobada.
- [ ] Detecta consultas sensibles, reclamos o solicitudes regulatorias y las deriva.
- [ ] Crea un ticket con historial, contexto y prioridad para el equipo humano.
- [ ] El usuario puede solicitar escalamiento a humano en cualquier momento.
- [ ] El ticket incluye toda la conversación previa para contexto.

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-17 | ¿Cómo se alimenta la base de conocimiento? | Carga manual por admin / Scraping de docs / API externa |
| P-18 | ¿Quién recibe los tickets derivados? | Equipo interno / Sistema de soporte existente / Email |
| P-19 | ¿Las prioridades se calculan automáticamente o se asignan manualmente? | Automática (por keywords) / Manual |
| P-20 | ¿Se pueden reabrir tickets resueltos? | Sí / No |

---

## Lista completa de pendientes

| # | Requisito | Pregunta |
|---|---|---|
| P-1 | RF-01 | ¿Se requiere verificación de email? |
| P-2 | RF-01 | ¿Requisitos de contraseña? |
| P-3 | RF-01 | ¿Se permite eliminar cuenta? |
| P-4 | RF-01 | ¿OAuth solo Google o también otros proveedores? |
| P-5 | RF-02 | ¿Formato exacto del CSV bancario? |
| P-6 | RF-02 | ¿Límite de transacciones por CSV? |
| P-7 | RF-02 | ¿Qué pasa si el CSV tiene filas con errores? |
| P-8 | RF-02 | ¿Categorías predefinidas o el usuario crea las suyas? |
| P-9 | RF-03 | ¿El umbral se define en porcentaje o valor fijo? |
| P-10 | RF-03 | ¿Se pueden editar presupuestos existentes? |
| P-11 | RF-03 | ¿Se pueden eliminar presupuestos? |
| P-12 | RF-03 | ¿Un usuario puede tener varios presupuestos por categoría? |
| P-13 | RF-04 | ¿Canal de envío de alertas? |
| P-14 | RF-04 | ¿Las alertas se envían en tiempo real o en resumen? |
| P-15 | RF-04 | ¿El usuario puede desactivar alertas por categoría? |
| P-16 | RF-05 | ¿Cómo se alimenta la base de conocimiento? |
| P-17 | RF-05 | ¿Quién recibe los tickets derivados? |
| P-18 | RF-05 | ¿Las prioridades se calculan automáticamente o manualmente? |
| P-19 | RF-05 | ¿Se pueden reabrir tickets resueltos? |

---

## Referencia con hackathon-instructions.md

| Historia de usuario (Hackathon) | Requisito (Este documento) |
|---|---|
| H1: Registro conversacional de gastos | RF-02 |
| H2: Presupuesto e insights proactivos | RF-03, RF-04 |
| H3: Soporte financiero 24/7 con escalamiento | RF-05 |
| Login/perfil (requerimiento propio) | RF-01 |
