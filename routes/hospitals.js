const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('GET request is setup for Hospitals List');
    res.json({ message: 'Just for testing'});
});

module.exports = router;