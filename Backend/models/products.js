const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    description:{type:String},
    price:{type:Number,required:true},
    product_img:{type:String}
},
{
    timestamps:true,
    collection:"products"
}
)
module.exports=mongoose.model("Product",productSchema)