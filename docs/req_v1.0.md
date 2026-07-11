# Requisitos funcionales - v1.0

---

## RF-01 - Inicio de sesión

- El usuario puede registrarse con:
    - nombre de usuario
    - email
    - contraseña y confirmación
- El usuario puede registrarse con Oauth de Google, pero debe crear su nombre de usuario
- El usuario puede logearse con Google o con usuario/contraseña
- Luego del registro inicial y haber iniciado sesion se puede rellenar datos como:
    - celular: para bot de Whatsapp
    - moneda: para mostrar la moneda correcta en el front

## RF-02 - Registro de transacciones

Prerequisitos:

- Estar logueado como usuario para tener referencia de quien realiza los registros

Funcionalidad:

- Tener un bot por Whatsapp, también un equivalente en la app web que transforme mensajes en datos de transacciones, el bot o la app reciben:
    
    ```json
    {
      "usuario_id": "12345",
      "mensaje": "Quiero registrar un gasto de 10 dólares"
    } 
    ```
    
- La respuesta serían los datos de la transacción a registrar:
    
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
    

acción: puede ser INGRESO, GASTO

- El aplicativo manda un mensaje de confirmación para llenar datos faltantes o ambiguos
- Para que el bot tenga referencia del usuario que hace los registros, el usuario debe haberse registrado en la aplicacion y haber registrado su númeor de whatsapp, caso contrario el bot le hará saber que no tiene referencia del número del que le escriben mostrando un link para el registro.
- Se pueden registrar varias transacciones usando un csv bancario, tanto por Whatsapp como por la app web

## RF-03 - Registro de presupuestos y configuracion de umbrales

- Los presupuestos mensuales se pueden definir desde el bot de whatsapp? cómo?
- Los presupuestos necesitan saber el monto y la categoría
- El umbral se define con porcentaje o por valor?
- Para saber cuanto se ha gastado mensualmente en esa categoría se suman los gastos provenientes de esa categoría

## RF-04 - Alertas

Si lo gastado mensualmente en una categoría pasa el umbral se envia una alerta (por notificación movil, whatsapp o notificación en la app?) Se muestran los valores de lo gastado, el presupuesto definido y el umbral
