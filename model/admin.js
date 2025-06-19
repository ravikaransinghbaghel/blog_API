import mongoose from "mongoose";

const isAdminScheema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mob_no: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model('Admin', isAdminScheema);