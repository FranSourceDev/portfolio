const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, description, technologies } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and description'
            });
        }

        // Process uploaded files
        const images = [];
        const videos = [];

        if (req.files) {
            req.files.forEach(file => {
                const filePath = `/uploads/${file.filename}`;

                if (file.mimetype.startsWith('image/')) {
                    images.push(filePath);
                } else if (file.mimetype.startsWith('video/')) {
                    videos.push(filePath);
                }
            });
        }

        // Parse technologies if it's a string
        let techArray = [];
        if (technologies) {
            techArray = typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim())
                : technologies;
        }

        // Create project
        const project = await Project.create({
            title,
            description,
            images,
            videos,
            technologies: techArray
        });

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const { title, description, technologies } = req.body;

        // Process new uploaded files
        const newImages = [];
        const newVideos = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = `/uploads/${file.filename}`;

                if (file.mimetype.startsWith('image/')) {
                    newImages.push(filePath);
                } else if (file.mimetype.startsWith('video/')) {
                    newVideos.push(filePath);
                }
            });
        }

        // Parse technologies if it's a string
        let techArray = project.technologies;
        if (technologies !== undefined) {
            techArray = typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim())
                : technologies;
        }

        // Update project
        project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                title: title || project.title,
                description: description || project.description,
                images: newImages.length > 0 ? [...project.images, ...newImages] : project.images,
                videos: newVideos.length > 0 ? [...project.videos, ...newVideos] : project.videos,
                technologies: techArray,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete associated files
        const deleteFile = (filePath) => {
            const fullPath = path.join(__dirname, '..', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        };

        // Delete all images and videos
        project.images.forEach(deleteFile);
        project.videos.forEach(deleteFile);

        // Delete project from database
        await Project.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
