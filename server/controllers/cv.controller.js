const CV = require('../models/CV');
const path = require('path');
const { processProfileImage, deleteImage } = require('../utils/imageProcessor');

// @desc    Get CV
// @route   GET /api/cv
// @access  Public
const getCV = async (req, res) => {
    try {
        // Get the single CV document (singleton pattern)
        let cv = await CV.findOne();

        // If no CV exists, return empty structure
        if (!cv) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: cv
        });
    } catch (error) {
        console.error('Get CV error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update CV
// @route   PUT /api/cv
// @access  Private
const updateCV = async (req, res) => {
    try {
        // Handle FormData or JSON body
        let cvData = {};
        
        // If FormData, parse it; otherwise use req.body directly
        if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
            // Try to parse JSON strings in FormData fields
            if (req.body.cvData) {
                try {
                    cvData = typeof req.body.cvData === 'string' ? JSON.parse(req.body.cvData) : req.body.cvData;
                } catch (e) {
                    cvData = req.body;
                }
            } else {
                cvData = req.body;
            }
        }

        // Find existing CV or create new one
        let cv = await CV.findOne();

        // Store old image path before updating (to delete it later if new image is uploaded)
        let oldImagePath = null;
        if (cv && cv.personalInfo && cv.personalInfo.profileImage) {
            oldImagePath = cv.personalInfo.profileImage;
        }

        // Process uploaded profile image
        if (req.file) {
            const originalFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
            
            try {
                // Process image: convert to WebP, resize, optimize
                const processedImagePath = await processProfileImage(originalFilePath);
                
                if (!cvData.personalInfo) {
                    cvData.personalInfo = {};
                }
                cvData.personalInfo.profileImage = processedImagePath;
                
                // Delete old image if it exists and is different from the new one
                if (oldImagePath && oldImagePath !== processedImagePath) {
                    deleteImage(oldImagePath);
                }
            } catch (error) {
                console.error('Error processing profile image:', error);
                // Fallback: use original image if processing fails
                const fallbackPath = `/uploads/${req.file.filename}`;
                if (!cvData.personalInfo) {
                    cvData.personalInfo = {};
                }
                cvData.personalInfo.profileImage = fallbackPath;
            }
        }

        if (cv) {
            // Update existing CV
            // Handle nested personalInfo updates
            if (cvData.personalInfo) {
                if (!cv.personalInfo) {
                    cv.personalInfo = {};
                }
                Object.keys(cvData.personalInfo).forEach(key => {
                    if (cvData.personalInfo[key] !== undefined) {
                        cv.personalInfo[key] = cvData.personalInfo[key];
                    }
                });
            }
            
            // Update other fields
            Object.keys(cvData).forEach(key => {
                if (key !== 'personalInfo' && cvData[key] !== undefined) {
                    cv[key] = cvData[key];
                }
            });
            
            cv.updatedAt = Date.now();
            await cv.save();
        } else {
            // Create new CV
            cv = await CV.create(cvData);
        }

        res.json({
            success: true,
            data: cv
        });
    } catch (error) {
        console.error('Update CV error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getCV,
    updateCV
};


