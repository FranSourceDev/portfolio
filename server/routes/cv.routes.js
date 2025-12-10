const express = require('express');
const {
    getCV,
    updateCV
} = require('../controllers/cv.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route
router.get('/', getCV);

// Protected route (require authentication)
router.put('/', protect, updateCV);

module.exports = router;


