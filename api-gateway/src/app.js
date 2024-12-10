const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Importar rutas
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const favoritesRoutes = require('./routes/favorites');

// Registrar rutas
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);

module.exports = app;