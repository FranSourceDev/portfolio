const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes (require authentication)
router.post('/', protect, upload.array('files', 10), createProject);
router.put('/:id', protect, upload.array('files', 10), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
