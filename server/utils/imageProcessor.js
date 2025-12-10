const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Process profile image: convert to WebP, resize, and optimize
 * @param {string} originalFilePath - Path to the original uploaded image
 * @returns {Promise<string>} - Path to the processed image
 */
async function processProfileImage(originalFilePath) {
    try {
        // Check if sharp is available
        if (!sharp) {
            console.warn('Sharp not available, skipping image processing');
            return originalFilePath;
        }

        // Validate file exists
        if (!fs.existsSync(originalFilePath)) {
            throw new Error('Original image file not found');
        }

        // Generate output path (same directory, change extension to .webp)
        const parsedPath = path.parse(originalFilePath);
        const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

        // Process image with sharp
        await sharp(originalFilePath)
            .resize(600, 600, {
                fit: 'cover', // Crop to square if needed, centered
                position: 'center'
            })
            .webp({
                quality: 85, // Balance between quality and file size
                effort: 4 // Compression effort (0-6, higher = slower but better compression)
            })
            .toFile(outputPath);

        // Delete original file after successful processing
        try {
            fs.unlinkSync(originalFilePath);
            console.log(`Deleted original image: ${originalFilePath}`);
        } catch (deleteError) {
            console.warn(`Failed to delete original image: ${deleteError.message}`);
            // Don't throw, processed image is still valid
        }

        // Return the path relative to uploads directory for URL
        const relativePath = `/uploads/${path.basename(outputPath)}`;
        console.log(`Image processed successfully: ${relativePath}`);
        return relativePath;

    } catch (error) {
        console.error('Error processing profile image:', error);
        // Return original path as fallback
        return originalFilePath;
    }
}

/**
 * Delete an image file
 * @param {string} imagePath - Path to the image (can be relative or absolute)
 */
function deleteImage(imagePath) {
    try {
        // Handle both relative paths (/uploads/file.webp) and absolute paths
        let filePath = imagePath;
        if (imagePath.startsWith('/uploads/')) {
            filePath = path.join(__dirname, '..', imagePath);
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted image: ${filePath}`);
            return true;
        } else {
            console.warn(`Image file not found: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting image ${imagePath}:`, error);
        return false;
    }
}

module.exports = {
    processProfileImage,
    deleteImage
};

