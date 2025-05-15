const express = require('express');
const { type, video } = require('../controllers/speechController.js');

const router = express.Router();

router.post('/type', type);

router.patch('/video', video);

module.exports = router;
