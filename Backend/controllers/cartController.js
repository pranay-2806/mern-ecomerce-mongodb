const Cart=require("../models/cart")
const Product=require("../models/products")

const mongoose=require("mongoose")

//GET usercart (with products details)
const getCart=async(req,res)=>{
    try{
        const userId=req.params.userId

        const items = await Cart.find({user_id:userId})
        .populate("product_id","name price product_img") //select fields

        return res.json(items)
    }catch(err){
        console.error("Get cart error:",err)
        return res.status(500).json({message:"Failed to get cart"})
    }
}

const addToCart=async(req,res)=>{
    try{
        const{user_id,product_id}=req.body

        if(!mongoose.Types.ObjectId.isValid(user_id))
            return res.status(400).json({message:"Invalid user id"})

        if (!mongoose.Types.ObjectId.isValid(product_id))
            return res.status(400).json({ message: "Invalid product id" });

        //check if user exists
        const existing=await Cart.findOne({user_id,product_id})
        if(existing){
            existing.qty += 1
            await existing.save()
            
            return res.json(existing)
        }
        const item=await Cart.create({
            user_id,
            product_id,
            qty:1
        })
        return res.json(item)
    }catch(err){
        console.error("add to cart error:",err)
        return res.status(500).json({message:"failed to add to cart"})
    }
}

//update qty
const updateQty=async(req,res)=>{
    try{
        const{user_id,product_id,qty}=req.body

        if (qty < 1)
        return res.status(400).json({ message: "qty must be >= 1" });
    
            await Cart.updateOne(
                {user_id,product_id},
            {qty}
        )
        return res.json({message:"Quantity updated"})
    }catch(err){
        console.error("Update qty error:",err)
        return res.status(500).json({message:"failed to updated Quantity"})
    }
}

//Remove one item
const removeItem=async(req,res)=>{
    try{
        const{user_id,product_id}=req.body
        await Cart.deleteOne({user_id,product_id})
        return res.json({message:"Item removed"})
    }catch(err){
        console.error("remove item error",err)
        return res.status(500).json({message:"Failed to remove item"})
    }
}

//Clear whole cart
const clearCart=async(req,res)=>{
    try{
    const user_id=req.params.userId
    await Cart.deleteMany({user_id})

    return res.json({message:"cart cleared"})
    }catch(err){
        console.error("clear cart error:",err)
        return res.status(500).json({message:"Failed to clear cart!"})
    }
}

module.exports={getCart,addToCart,updateQty,removeItem,clearCart}


