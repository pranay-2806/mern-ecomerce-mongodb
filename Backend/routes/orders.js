const express=require("express")
const orders=express.Router()
const {createOrder,verifyPayment}=require("../controllers/razorpayController")

orders.post("/order",createOrder)
orders.post("/verify",verifyPayment)

module.exports=orders