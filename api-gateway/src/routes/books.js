// books.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Books API working!');
});

module.exports = router;