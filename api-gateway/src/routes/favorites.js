const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = 'http://localhost:5000'; // URL del microservicio Flask

// Ruta para obtener favoritos
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/favorites`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});

// Ruta para eliminar un favorito
router.delete('/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${USER_SERVICE_URL}/favorites/${req.params.id}`, {
            headers: { Authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});

// Ruta para agregar un favorito
router.post('/', async (req, res) => {
    try {
      console.log('Encabezados recibidos:', req.headers); // Depuración
      const response = await axios.post(`${USER_SERVICE_URL}/favorites`, req.body, {
        headers: { Authorization: req.headers.authorization }, // Reenvía el encabezado de autorización
      });
      console.log('Respuesta del microservicio:', response.data); // Depuración
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`Error en POST /favorites: ${error.message}`);
      console.error('Detalles del error:', error.response?.data || 'Sin detalles adicionales');
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
  });

module.exports = router;
