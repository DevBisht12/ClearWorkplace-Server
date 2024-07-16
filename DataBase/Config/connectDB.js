import mongoose from "mongoose";


const ConnectDB= async(DATABASE_URL)=>{
    try {
        const DB_OPATIONS={
            dbName:'clearWorkplaceDB'
        }
        await mongoose.connect(DATABASE_URL,DB_OPATIONS)
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export default ConnectDB