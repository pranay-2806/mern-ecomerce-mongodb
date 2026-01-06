const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema(
    {
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        items:[
            {
                product_id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"product",
                    required:true
                },
                qty:{type:Number,required:true},
                price:{type:Number,required:true}
            }
        ],
        total:{type:Number,required:true},

        status:{
            type:String,
            enum:["pending","paid","shipped","delivered","cancelled"],
            default:"pending"
        }
    },
    {
        timestamps:true,
        collection:"orders"
    }
)
module.exports=mongoose.model("Order",orderSchema)