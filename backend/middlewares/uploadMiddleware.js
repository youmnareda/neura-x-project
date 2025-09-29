const multer = require('multer');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Type Check
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|dcm/; // png, jpeg, jpg, dicom images
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
