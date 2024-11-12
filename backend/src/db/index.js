import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

const connectionDB = async()=>{
    try {
       
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)        
    }
}

export default connectionDB