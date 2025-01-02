const app = require('./src/app'); // Importa el archivo app.js
const PORT = 4001;

// Verifica que `app` sea una instancia válida de Express
if (!app || typeof app.listen !== 'function') {
  console.error("Error: `app` no es una instancia válida de Express.");
  process.exit(1);
}

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
