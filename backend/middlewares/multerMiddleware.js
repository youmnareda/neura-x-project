const multer = require('multer');

// Use memory storage for in-memory file processing (e.g., with Sharp)
const multerStorage = multer.memoryStorage();

// File filter to accept only image files
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        const error = new Error('Not an image! Please upload only images.');
        error.statusCode = 400;
        cb(error, false);
    }
};

// Create multer instance with memory storage, file filter, and size limit
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Return middleware that handles single file upload for a specific field
const uploadSingleImage = (fieldName) => upload.single(fieldName);

module.exports = uploadSingleImage;
