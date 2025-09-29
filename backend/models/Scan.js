const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image_path: {
        type: String,
        required: true
    },
    probability: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
  
}, {
    timestamps: true
});

const ScanModel = mongoose.model('Scan', scanSchema);

module.exports = ScanModel;
