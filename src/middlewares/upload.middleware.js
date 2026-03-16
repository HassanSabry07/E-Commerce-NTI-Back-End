const multer = require('multer');
const path = require('path');

const allowedExt = ['.png', '.jpg', '.jpeg'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) return cb(new Error('Only images are allowed'), false);
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads'); },
  filename:    (req, file, cb) => { cb(null, Date.now() + '_' + file.originalname); }
});

const MB = 1024 * 1024;
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * MB } });

module.exports = upload;
