import { v2 as cloudinary } from 'cloudinary';


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImg = async (loadFile) => {
    await cloudinary.v2.uploader
        .upload(loadFile, {
            resource_type: "auto",
            folder: 'blog_images',
        })
        .then(result => console.log(result));
}
