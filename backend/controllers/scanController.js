const fs = require('fs');
const path = require('path');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const axios = require("axios");
const FormData = require("form-data");
const ScanModel = require("../models/Scan");
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');





exports.uploadScan = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const userId = req.user._id;

    // Generate unique file name
    const filename = `${uuidv4()}_${req.file.originalname}`;
    const savePath = path.join(__dirname, '../uploads', filename);

    // Save the image locally
    fs.writeFileSync(savePath, req.file.buffer);

    // Copy to Flask project folder
    const flaskPath = path.join(
      'C:', 'Users', 'youmna', 'Desktop', 'New folder (2)',
      'AI_Cancer', 'Khaled_CancerChat', 'Khaled_CancerChat', 'static',
      filename
    );

    // Ensure destination folder exists (optional but recommended)
    fs.copyFileSync(savePath, flaskPath);

    // 📤 Send to Flask for prediction
    const formData = new FormData();
    formData.append("image", fs.createReadStream(savePath)); // Send from disk instead of buffer

    const flaskResponse = await axios.post(
      "http://127.0.0.1:5001/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const result = flaskResponse.data;

    const createdScan = await ScanModel.create({
      user: userId,
      image_path: savePath,
      ...result,
    });

    res.status(200).json({
      message: "You Scan Diagnosis is Ready",
      scan: createdScan,
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Failed to process image", error: err.message });
  }
};

// Get All Scans of the Logged-in User
exports.getMyScans = async (req, res) => {
  try {
    const scans = await ScanModel.find({ user: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Here's The All Scans", data: scans });
  } catch (error) {
    res.status(500).json(err);
  }
};

// Delete a Scan by ID
exports.deleteScan = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid scan ID." });
    }

    const scan = await ScanModel.findById(id);

    // If no scan found
    if (!scan) {
      return res.status(404).json({ message: "Scan not found." });
    }

    // Ensure req.user is defined and has _id
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User info missing." });
    }

    // Check if user owns the scan
    if (scan.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this scan." });
    }

    await scan.deleteOne();

    res.status(200).json({ message: "Your Scan Deleted Successfully", data: null });
  } catch (error) {
    console.error("Delete scan error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Export Scans To PDF
exports.exportScanToPDF = async (req, res) => {
  try {
    res.setHeader('Content-Disposition', 'attachment; filename="test.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.end(pdfData);
    });

    doc.fontSize(25).text('Test PDF is working!', 100, 100);
    doc.end();
  } catch (error) {
    console.error("❌ PDF export error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};






