const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Importar rutas
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');

// Configurar rutas
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;