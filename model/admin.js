import mongoose from "mongoose";

const isAdminScheema = new mongoose.Schema({
    username: {
        type: String,
        default: 'karanravi@123',
        unique: true
    },
    password: {
        type: String,
        default: 'karanravi@123'
    }
})

export default mongoose.model('Admin', isAdminScheema);