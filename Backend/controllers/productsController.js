const Product=require("../models/products")

const getProducts=async(req,res)=>{
    try{
        const products=await Product.find();   //fetch all products
        res.json(products)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports={getProducts}




