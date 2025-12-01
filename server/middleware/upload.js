const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    // Allowed image types
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    // Allowed video types
    const videoTypes = /mp4|webm|mov|avi/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Check if it's an image
    if (imageTypes.test(extname.slice(1)) && mimetype.startsWith('image/')) {
        return cb(null, true);
    }

    // Check if it's a video
    if (videoTypes.test(extname.slice(1)) && mimetype.startsWith('video/')) {
        return cb(null, true);
    }

    cb(new Error('Invalid file type. Only images (jpg, png, gif, webp) and videos (mp4, webm, mov, avi) are allowed.'));
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    fileFilter: fileFilter
});

module.exports = upload;
