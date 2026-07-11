# Requisitos Funcionales v1.1

**Proyecto:** Hackathon de Agentes Financieros IA - Track 2
**Fecha:** Julio 2026
**Estado:** Borrador - Pendiente de definición en equipo

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

El usuario puede registrar ingresos y gastos mediante lenguaje natural, ya sea por WhatsApp (bot) o por la app web (chat equivalente). El sistema interpreta el mensaje, extrae los datos de la transacción y solicita confirmación antes de guardar.

### Precondiciones

- El usuario debe estar registrado y haber iniciado sesión.
- Si usa WhatsApp, debe haber registrado su número de celular en el perfil.

### Flujos

#### Flujo 1: Registro por mensaje de texto (WhatsApp o Web)

1. El usuario envía un mensaje en lenguaje natural, ej: "gasté 25 dólares en comida".
2. El agente interpreta el mensaje y extrae:
    - **Acción:** INGRESO o GASTO
    - **Monto:** numérico
    - **Categoría:** comida, transporte, salud, etc.
    - **Entidad/Comercio:** opcional
    - **Fecha:** si no se menciona, usa la fecha actual.
3. El agente responde con los datos interpretados y pide confirmación.
4. El usuario confirma o corrige.
5. Se guarda la transacción.
6. Se muestra un resumen actualizado (ingresos, gastos, saldo).

**Estructura de entrada:**

```json
{
  "usuario_id": "12345",
  "mensaje": "Quiero registrar un gasto de 10 dólares"
}
```

**Estructura de salida:**

```json
{
  "accion": "GASTO",
  "datos": {
    "monto": 50.00,
    "categoria": "Acciones",
    "entidad": "Apple",
    "fecha": "2026-07-11"
  },
  "respuesta_chat": "¡Excelente! He registrado tu inversión de $50 en Apple. ¡A multiplicar ese dinero!"
}
```

#### Flujo 2: Registro por CSV bancario

1. El usuario sube un archivo CSV con transacciones.
2. El sistema valida el formato y muestra una vista previa.
3. El usuario confirma o edita las transacciones antes de importar.
4. Se guardan todas las transacciones validadas.

#### Flujo 3: Validación de usuario por WhatsApp

1. Un número desconocido envía un mensaje al bot.
2. El bot responde indicando que no tiene registro del número y muestra un link de registro.
3. El usuario se registra y vincula su número.
4. A partir de ahí, el bot reconoce al usuario.

### Criterios de aceptación

- [ ] El agente interpreta mensajes en lenguaje natural y extrae monto, categoría, entidad y fecha.
- [ ] El agente pide confirmación cuando falta información o hay ambigüedad.
- [ ] Se guardan transacciones de tipo INGRESO y GASTO.
- [ ] El resumen de ingresos/gastos/saldo se actualiza correctamente.
- [ ] El usuario no registrado por WhatsApp recibe un link de registro.
- [ ] El CSV se puede subir por WhatsApp y por la app web.
- [ ] La importación CSV muestra vista previa antes de confirmar.

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-5 | ¿Formato exacto del CSV bancario? | Estándar del banco / Formato propio a definir |
| P-6 | ¿Cómo se envía el CSV por WhatsApp? | Archivo adjunto en el chat / Link a página de upload |
| P-7 | ¿Límite de transacciones por CSV? | Sin límite / Máx 100 / Máx 500 |
| P-8 | ¿Qué pasa si el CSV tiene filas con errores? | Saltar filas erróneas / Rechazar todo / Mostrar resumen de errores |
| P-9 | ¿Categorías predefinidas o el usuario crea las suyas? | Lista fija / Usuario crea / Mixto |

---

## RF-03 - Registro de presupuestos y configuración de umbrales

### Descripción

El usuario puede definir presupuestos mensuales por categoría y configurar umbrales para recibir alertas cuando se acerque o supere el límite.

### Precondiciones

- El usuario debe estar registrado y haber iniciado sesión.
- Debe existir al menos una categoría de gasto definida.

### Flujos

#### Flujo 1: Crear presupuesto por WhatsApp

1. El usuario envía un mensaje como: "presupuesto comida 500" o "límite mensual comida $500".
2. El agente interpreta: categoría = comida, monto = 500.
3. El agente confirma: "Entendido, tu presupuesto de comida es $500/mes. ¿Correcto?"
4. El usuario confirma o corrige.
5. Se guarda el presupuesto.

#### Flujo 2: Crear presupuesto por la app web

1. El usuario navega a la sección de presupuestos.
2. Selecciona una categoría, ingresa el monto mensual y configura el umbral.
3. Guarda el presupuesto.

#### Flujo 3: Consultar presupuesto

1. El usuario pregunta por WhatsApp: "¿Cuánto me queda de comida este mes?"
2. El agente consulta los gastos de la categoría en el mes actual.
3. Responde con: monto gastado, presupuesto restante y porcentaje usado.

### Criterios de aceptación

- [ ] Se puede crear un presupuesto mensual por categoría desde WhatsApp.
- [ ] Se puede crear un presupuesto mensual por categoría desde la app web.
- [ ] El presupuesto requiere: categoría y monto mensual.
- [ ] El gasto mensual por categoría se calcula sumando los gastos de esa categoría en el mes.
- [ ] Se puede consultar el estado del presupuesto por WhatsApp.

### Pendientes

| # | Pregunta | Opciones posibles |
|---|---|---|
| P-10 | ¿El umbral se define en porcentaje o valor fijo? | Porcentaje (ej: 80%) / Valor fijo (ej: $400) / Ambos |
| P-11 | ¿Se pueden editar presupuestos existentes? | Sí / No (solo crear uno nuevo) |
| P-12 | ¿Se pueden eliminar presupuestos? | Sí / No |
| P-13 | ¿Un usuario puede tener varios presupuestos por categoría? | No (uno por categoría) / Sí (ej: comida normal + comida restaurantes) |

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
| P-6 | RF-02 | ¿Cómo se envía el CSV por WhatsApp? |
| P-7 | RF-02 | ¿Límite de transacciones por CSV? |
| P-8 | RF-02 | ¿Qué pasa si el CSV tiene filas con errores? |
| P-9 | RF-02 | ¿Categorías predefinidas o el usuario crea las suyas? |
| P-10 | RF-03 | ¿El umbral se define en porcentaje o valor fijo? |
| P-11 | RF-03 | ¿Se pueden editar presupuestos existentes? |
| P-12 | RF-03 | ¿Se pueden eliminar presupuestos? |
| P-13 | RF-03 | ¿Un usuario puede tener varios presupuestos por categoría? |
| P-14 | RF-04 | ¿Canal de envío de alertas? |
| P-15 | RF-04 | ¿Las alertas se envían en tiempo real o en resumen? |
| P-16 | RF-04 | ¿El usuario puede desactivar alertas por categoría? |
| P-17 | RF-05 | ¿Cómo se alimenta la base de conocimiento? |
| P-18 | RF-05 | ¿Quién recibe los tickets derivados? |
| P-19 | RF-05 | ¿Las prioridades se calculan automáticamente o manualmente? |
| P-20 | RF-05 | ¿Se pueden reabrir tickets resueltos? |

---

## Referencia con hackathon-instructions.md

| Historia de usuario (Hackathon) | Requisito (Este documento) |
|---|---|
| H1: Registro conversacional de gastos | RF-02 |
| H2: Presupuesto e insights proactivos | RF-03, RF-04 |
| H3: Soporte financiero 24/7 con escalamiento | RF-05 |
| Login/perfil (requerimiento propio) | RF-01 |
