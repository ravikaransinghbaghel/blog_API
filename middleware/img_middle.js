import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.CLOUDINARU_API_KEY,
    api_secret: process.env.CLOUDINARU_API_SECRET,
});

// Create Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage });

export { upload };