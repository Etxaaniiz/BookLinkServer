const express = require("express");
const axios = require("axios");

const router = express.Router();
const USER_SERVICE_URL = "http://localhost:5000/api";

// Proxy para detalles del libro
router.get("/:book_id", async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/details/${req.params.book_id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Error en GET /details/${req.params.book_id}: ${err.message}`);
    res.status(err.response?.status || 500).json({
      error: "Error al obtener los detalles del libro",
      details: err.message,
    });
  }
});

module.exports = router;