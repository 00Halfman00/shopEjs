const multer = require('multer');

exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb ) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  }
})

exports.fileFilter = (req, file, cb) => {
  cb(null, (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'));
}
