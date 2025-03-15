const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const port = 3000;

// Middleware to parse incoming requests with JSON payload
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Set up Multer for handling file uploads (like logo and menu photos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// Sample route for business registration
app.post('/api/business/register', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'menuImages', maxCount: 10 }
]), (req, res) => {
  const { name, businessName, location, menuItems } = req.body;
  const logo = req.files['logo'] ? req.files['logo'][0].path : null;
  const menuImages = req.files['menuImages'] ? req.files['menuImages'].map(file => file.name) : [];
})
