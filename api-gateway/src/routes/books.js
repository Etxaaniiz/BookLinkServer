const express = require('express');
const axios = require('axios');
const router = express.Router();

const BOOK_SEARCH_SERVICE_URL = 'http://localhost:4000';

// Ruta para búsqueda de libros
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BOOK_SEARCH_SERVICE_URL}/search`, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error en GET /books: ${error.message}`);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

module.exports = router;
