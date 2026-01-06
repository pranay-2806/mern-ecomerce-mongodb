const mongoose=require("mongoose")

const cartSchema=new mongoose.Schema(
    {
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    qty:{
        type:Number,
        default:1,
        min:1
    }
},
{
    timestamps:true,
    collection:"carts"
}
)
module.exports=mongoose.model("Cart",cartSchema)