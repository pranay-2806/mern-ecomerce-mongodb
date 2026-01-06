const mongoose=require("mongoose")

const connectDB=()=>{
    return mongoose.connect(process.env.MONGODB_URI,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true
    })
    .then(()=>{
        console.log("MongoDB connected")
    })
    .catch((err)=>{
        console.error("MongoDB connection error:",err.message)
        process.exit(1)
    })
}

module.exports=connectDB