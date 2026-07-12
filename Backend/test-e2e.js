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
        mensaje: "Hoy tuve un día movido: gasté 20 dólares en comida rápida, luego pagué 150 de la matrícula de educación. En la tarde gasté 30 en entradas para el cine y 45 en la farmacia por temas de salud. Pagué 60 del recibo de luz y 15 en taxis de transporte. Finalmente, me depositaron 1200 dólares de mi salario, vendí mi tele en 400 dolares ."
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
