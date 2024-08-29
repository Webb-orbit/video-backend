import mongoose from "mongoose"

const dbconnect = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB}/hello-name`)
        console.log("mongo is connected");
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default dbconnect