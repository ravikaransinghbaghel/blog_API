import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import dotenv from 'dotenv';
dotenv.config();


/* use for save file on local folder

import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});
*/


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log('API_KEY from env: ', process.env.CLOUDINARY_API_KEY);

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog_images',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        quality: 'auto',        
        fetch_format: 'auto',
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 } // 1 MB max
});

export default upload;
