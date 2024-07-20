import multer from 'multer'
import cloudinary from '../utils/cloudinary.utils.js';
import { CloudinaryStorage} from 'multer-storage-cloudinary'

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
     folder: 'uploads',
     format: async (req, file) => 'auto',
     public_id: (req, file) => Date.now() + '-' + file.originalname,
   },
 });
 
export const upload = multer({ storage });

// need to study about multer 