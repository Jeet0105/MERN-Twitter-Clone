import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path";

// Load environment variables from the .env file
dotenv.config({
    path: path.resolve(process.cwd(), "../.env")
});

const databaseConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Connected to mongodb");
        })
        .catch((error)=>{
            console.log(error);
        })
}

export default databaseConnection;