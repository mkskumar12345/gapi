const multer = require('multer');
const path = require('path');
const { CreateError } = require('./create_err');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/project'); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Filename
  }
});

const imageFilter = (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname);
  
    if (
      allowedExtensions.includes(fileExtension.toLowerCase()) &&
      !file.originalname.match(/\.[^.]*\./)
    ) {
      cb(null, true);
    } else {
        cb(new CreateError("FileValError","Only PNG, JPG, and JPEG images are allowed"));
    }
  };

const uploadProject = multer({
    storage: storage,
    fileFilter: imageFilter // Add the file filter to the multer options
  });

module.exports = uploadProject;
