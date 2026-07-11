# GUIA DE DESARROLLO

## Hackathon de Agentes Financieros IA

### Track 2

**Historias de usuario y criterios mínimos para productos funcionales en 48 horas**

Julio de 2026

---

## Regla de alcance para todos los equipos

Cada producto debe cumplir, como mínimo, con los requisitos y criterios de aceptación definidos para su track. Los equipos pueden agregar funcionalidades, automatizaciones, integraciones o experiencias que consideren necesarias, siempre que no eliminen ni sustituyan el alcance mínimo requerido.

## Condiciones de demostración

- Se permiten datos ficticios, archivos de prueba e integraciones simuladas si el flujo funcional se puede demostrar de extremo a extremo.
- Las acciones reguladas o sensibles deben quedar como propuesta, alerta o solicitud de aprobación; no es necesario ejecutarlas en producción.
- Cada equipo conserva libertad creativa sobre interfaz, canal, tecnología y funcionalidades adicionales.

---

## Track 2: Interfaces Inteligentes para Finanzas Personales y Canales Masivos

**Agentes involucrados:** Agente de Finanzas Personales por WhatsApp; Asistente Financiero para Clientes.

**Problema que resuelve:** Permite que una persona gestione gastos y reciba soporte financiero desde canales cotidianos como WhatsApp o web.

---

### Historia de Usuario 1: Registro conversacional de gastos

**Como:** usuario de una app financiera

**Quiero:** registrar un gasto escribiendo lenguaje natural

**Para que:** pueda conocer mi situación financiera sin llenar formularios.

#### Criterios de aceptación

- El Agente de Finanzas Personales interpreta mensajes como: gasté 25 dólares en comida.
- Clasifica monto, fecha, categoría y comercio; pide confirmación cuando falte información.
- Actualiza un resumen de ingresos, gastos y saldo usando datos de prueba o un CSV bancario.

---

### Historia de Usuario 2: Presupuesto e insights proactivos

**Como:** usuario

**Quiero:** recibir alertas comprensibles sobre mis patrones de gasto

**Para que:** pueda anticiparme a problemas de liquidez o exceso de presupuesto

#### Criterios de aceptación

- El sistema permite definir al menos un presupuesto mensual por categoría.
- Genera una alerta al superar un umbral configurable.
- Explica el insight con datos del usuario, sin presentar recomendaciones de inversión como consejo personalizado.

---

### Historia de Usuario 3: Soporte financiero 24/7 con escalamiento

**Como:** cliente de la casa de valores

**Quiero:** resolver dudas sobre mi cuenta, procesos o documentos

**Para que:** pueda recibir ayuda inmediata y llegar a un humano cuando sea necesario

#### Criterios de aceptación

- El Asistente Financiero responde desde una base de conocimiento aprobada.
- Detecta consultas sensibles, reclamos o solicitudes regulatorias y las deriva.
- Crea un ticket con historial, contexto y prioridad para el equipo humano.

---

## Productos similares en el mercado

- **Personetics:** [Personalized Insights to Enable KBC Bank's Client Dreams](https://personetics.com/resource-center/personalized-insights-to-enable-kbc-banks-client-dreams/)
- **Zendesk AI Agents:** [AI Agents](https://www.zendesk.com/service/ai/ai-agents/)
