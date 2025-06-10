import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.database);
        console.log('Database connected with:', connection.connection.host);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

export default connectDB;
