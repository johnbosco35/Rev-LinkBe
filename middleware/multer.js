const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the upload directory relative to the current file
const uploadDir = path.join(__dirname, "../uploads");

// Check if the upload directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}.${file.mimetype.split("/")[1]}`);
  },
});

module.exports = multer({ storage: storage });
