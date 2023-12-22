// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'nodejs-dan',
  api_key: '277958144157678',
  api_secret: '6Anr05tQMHE5Gt3xwseLe4aaXhg'
  // need to move to env
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinary
