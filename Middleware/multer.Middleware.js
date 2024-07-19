// import multer from 'multer'

// const storage =multer.diskStorage({
//     destination: function (req, file, cb) {
//        return cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//        return cb(null, Date.now() + '-' + file.originalname)
//     }
// })


// export const upload =multer({storage})

// // need to study about multer 



import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });