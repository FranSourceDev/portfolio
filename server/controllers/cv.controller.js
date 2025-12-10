const CV = require('../models/CV');

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
        const cvData = req.body;

        // Find existing CV or create new one
        let cv = await CV.findOne();

        if (cv) {
            // Update existing CV
            Object.keys(cvData).forEach(key => {
                if (cvData[key] !== undefined) {
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


