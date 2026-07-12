const fetch = require('node-fetch');

async function pruebaFlujoCompleto() {
  console.log("Iniciando prueba real END-TO-END...");
  console.log("Enviando mensaje al Backend de Kinti (como si fueras el Frontend)...");

  try {
    // 1. Enviamos el mensaje al endpoint del backend
    const response = await globalThis.fetch('http://127.0.0.1:3001/api/kinti/procesar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario_id: "12345689",
        mensaje: "Ayer me gasté 20 dólares en pollo asado en el asadero de la esquina"
      })
    });

    const data = await response.json();
    console.log("✅ Kinti respondió (Polling ID):", data);

    console.log("-----------------------------------------");
    console.log("El backend acaba de enviar el mensaje a tu n8n.");
    console.log("n8n debería estar procesando el mensaje ahora mismo...");
    console.log("Revisa la consola de tu Backend (npm run start:dev) para ver si llega el Callback de n8n.");

  } catch (error) {
    console.error("❌ ERROR DE CONEXIÓN:", error.message);
  }
}

pruebaFlujoCompleto();
