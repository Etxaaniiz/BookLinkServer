const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = 'http://localhost:5000';

// Ruta para registro
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error en /register: ${error.message}`);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error en /login: ${error.message}`);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
});

module.exports = router;
