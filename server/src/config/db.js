import mongoose from 'mongoose';
import env from './env.js';



let connectDB = async () => {
    try{
        await mongoose.connect(env.MONGODB_URI, )
        console.log("MongoDB connected successfully"); 
    } catch(error) {
        console.error("Error connecting to MongoDB:", error);
    }
}



export default connectDB;