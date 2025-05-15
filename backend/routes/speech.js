const express = require('express');
const { type } = require('../controllers/speechController.js');

const router = express.Router();

router.post('/type', type);

module.exports = router;
