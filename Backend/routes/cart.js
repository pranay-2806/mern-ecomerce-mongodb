const express=require("express")
const cart=express.Router()

const{getCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart}=require("../controllers/cartController")

cart.get("/:userId",getCart)
cart.post("/add",addToCart)
cart.put("/update",updateQty)
cart.delete("/remove",removeItem)
cart.delete("/clear/:userId",clearCart)

module.exports=cart