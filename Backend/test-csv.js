const fs = require('fs');
const path = require('path');

async function pruebaCargaCSV() {
  console.log("Iniciando prueba de carga de CSV END-TO-END...");

  const filePath = path.join(__dirname, '..', 'docs', 'data.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ El archivo no existe en:", filePath);
    return;
  }

  // En Node 18+ usamos la API nativa de Fetch y FormData
  const fileBuffer = fs.readFileSync(filePath);
  const fileBlob = new Blob([fileBuffer], { type: 'text/csv' });

  const formData = new FormData();
  formData.append('usuario_id', 'usuario-prueba-csv');
  formData.append('mensaje', 'Hola IA, por favor procesa y categoriza mis movimientos de este estado de cuenta en CSV.');
  // 'file' es el nombre del campo que espera el Interceptor de NestJS y n8n
  formData.append('file', fileBlob, 'data.csv');

  try {
    const response = await globalThis.fetch('http://127.0.0.1:3001/api/kinti/procesar', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log("✅ Kinti respondió:", data);

    console.log("-----------------------------------------");
    console.log("El Backend acaba de reenviar el CSV completo a n8n usando multipart/form-data.");
    console.log("n8n debería recibir el archivo binario y procesar todas sus filas.");
    console.log("Revisa la consola de n8n y de tu Backend.");

  } catch (error) {
    console.error("❌ ERROR DE CONEXIÓN:", error.message);
  }
}

pruebaCargaCSV();
