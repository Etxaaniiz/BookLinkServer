const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = 'http://localhost:5000';

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

module.exports = router;