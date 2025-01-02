const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from Google Books API' });
    }
});

// Endpoint para obtener detalles de un libro
router.get("/details/:bookId", async (req, res) => {
    const { bookId } = req.params;
  
    try {
      // Llamar a Google Books API con la clave API desde el .env
      const response = await axios.get(`${GOOGLE_BOOKS_API}/${bookId}`, {
        params: {
          key: process.env.GOOGLE_BOOKS_API_KEY,
        },
      });
  
      const bookData = response.data;
  
      // Extraer los detalles relevantes del libro
      const bookDetails = {
        id: bookData.id,
        title: bookData.volumeInfo.title || "Título no disponible",
        author: bookData.volumeInfo.authors?.join(", ") || "Autor no disponible",
        description: bookData.volumeInfo.description || "Descripción no disponible",
        publisher: bookData.volumeInfo.publisher || "Editorial no disponible",
        publishedDate: bookData.volumeInfo.publishedDate || "Fecha de publicación no disponible",
        pageCount: bookData.volumeInfo.pageCount || "N/A",
        language: bookData.volumeInfo.language || "Idioma no disponible",
        cover: bookData.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
      };
  
      res.json(bookDetails);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "No se pudieron obtener los detalles del libro.",
        details: error.message,
      });
    }
  });
  
  module.exports = router;

module.exports = router;