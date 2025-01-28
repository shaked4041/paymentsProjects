import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if(!mongoUrl){
            throw new Error('MongoDB URL is not provided');
        }
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error); 
    }
}

