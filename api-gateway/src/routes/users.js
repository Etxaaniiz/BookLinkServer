// users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Users API working!');
});

module.exports = router;