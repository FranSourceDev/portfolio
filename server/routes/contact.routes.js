const express = require('express');
const { sendContactEmail } = require('../controllers/contact.controller');

const router = express.Router();

// Public route
router.post('/', sendContactEmail);

module.exports = router;
