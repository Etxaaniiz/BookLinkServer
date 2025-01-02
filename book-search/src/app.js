const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
// Configuración de CORS
app.use(cors({
    origin: "http://localhost:3000", // Permitir solicitudes desde el frontend
  }));

// Importar rutas
const searchRoutes = require('./routes/search');

// Configurar rutas
app.use('/search', searchRoutes);
app.use("/api", searchRoutes);

module.exports = app;