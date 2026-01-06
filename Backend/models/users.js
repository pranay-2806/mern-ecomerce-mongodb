const mongoose=require("mongoose")

const userSchema=new mongoose.Schema(
    {
    username: { type: String, required: true, unique: true },
    email:{type:String,unique:true,lowercase:true},
    password:{type:String,required:true}
},
{
    timestamps:true,
    collection:"users"
}
)
module.exports=mongoose.model("user",userSchema)