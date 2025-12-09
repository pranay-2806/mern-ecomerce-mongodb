const express=require("express")
const products=express.Router()
const {getProducts}=require("../controllers/productsController")
const authMiddleware=require("../middlewares/authMiddleware")

products.get("/",authMiddleware,getProducts)
module.exports=products