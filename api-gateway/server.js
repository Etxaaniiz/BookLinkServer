const app = require("./src/app"); // Importa `app.js`
const PORT = 4001;

if (!app || typeof app.listen !== 'function') {
  console.error("Error: `app` no es una instancia válida de Express.");
  process.exit(1);
}

app.listen(PORT, () => {
    console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});