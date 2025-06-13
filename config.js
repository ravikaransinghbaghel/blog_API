import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.database);
        console.log('Database connected successful');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

export default connectDB;
