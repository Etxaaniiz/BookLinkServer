const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json()); // Analizar JSON en el cuerpo de la solicitud

// Importar rutas
const booksRoutes = require('./routes/books'); // Rutas para libros
const usersRoutes = require('./routes/users'); // Rutas de autenticación (login, registro)
const favoritesRoutes = require('./routes/favorites'); // Rutas de favoritos
const detailsRoutes = require('./routes/details'); // Rutas para detalles de libros

// Registrar rutas con prefijos consistentes
app.use('/api/books', booksRoutes); // Prefijo para libros
app.use('/api/users', usersRoutes); // Prefijo para autenticación
app.use('/api/favorites', favoritesRoutes); // Prefijo para favoritos
app.use('/api/details', detailsRoutes); // Prefijo para detalles de libros

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Exportar la instancia de Express
module.exports = app;
