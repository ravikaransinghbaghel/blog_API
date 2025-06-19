import mongoose from "mongoose";

const blogScheema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        require: true
    },
    cover_img_path: {
        type: String,
        require: true
    },
    cover_img_id: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },

}, { timestamps: true });

export default mongoose.model('Blog', blogScheema);