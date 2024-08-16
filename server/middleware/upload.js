// const multer = require('multer');
// const path = require('path');

// // Define storage for the images
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Directory to save the uploaded files
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

