const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:4000/search`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with book search microservice' });
    }
});

module.exports = router;