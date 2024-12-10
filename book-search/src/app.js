const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Importar rutas
const searchRoutes = require('./routes/search');

// Configurar rutas
app.use('/search', searchRoutes);

module.exports = app;