const multer = require('multer');
const asyncHandler = require('express-async-handler');
const uuidv4 = require('uuid').v4;
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary.js');

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, filename, folder, format = 'jpeg', quality = 'auto') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                resource_type: 'image',
                format,
                quality,
                overwrite: true
            },
            (error, result) => {
                if (error) {
                    const err = new Error(`Cloudinary Upload Error: ${error.message}`);
                    err.statusCode = 500;
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(buffer);
    });
};

// Middleware to resize and upload image
const resizeScanImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(); 

    try {
        const scanImageFileName = `scan-${uuidv4()}.jpeg`;

        const buffer = await sharp(req.file.buffer)
            .resize(500, 500, {
                fit: sharp.fit.cover,
                position: sharp.strategy.center
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();

        const result = await uploadToCloudinary(buffer, scanImageFileName, 'scans');

        req.body.imageUrl = result.secure_url;

        next();
    } catch (error) {
        const err = new Error('Error processing image upload');
        err.statusCode = 500;
        next(err);
    }
});

module.exports = resizeScanImage;
