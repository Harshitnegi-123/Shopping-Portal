const mongoose = require('mongoose')

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Connected")
    }catch(err){
        console.error("MongoDB Connection Error:", err.message);
        Process.exit(1)

    }
}

module.exports = connectDB