const Razorpay=require("razorpay")
const crypto=require("crypto")
const Cart=require("../models/cart")
const Order=require("../models/orders")
const products = require("../models/products")

const rzp=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

const getCartForUser = async (user_id) => {
  return Cart.find({ user_id })
    .populate("product_id", "name price product_img");
};

const createOrder=async(req,res)=>{
    try{
        const{user_id}=req.body
        if(!user_id){
            return res.status(400).json({message:"user_id required"})
        }
        //load cart with product details
        const items =await getCartForUser(user_id)
        if(!items || items.length==0){
            return res.status(400).json({message:"cart is empty"})
        }
        const total=items.reduce((sum,item)=>sum+Number(item.product_id.price)*Number(item.qty),0)
        const amountInPaise=Math.round(total*100)

        //create razorpay order
        const razorOrder=await rzp.orders.create({
            amount:amountInPaise,
            currency:"INR",
            receipt:`rcpt_${Date.now()}`,
            payment_capture:1
        })

        //save order in mongoDB
        await Order.create({
            user_id,
            items:items.map((i)=>({
                product_id:i.product_id._id,
                qty:i.qty,
                price:i.product_id.price,
            })),
            total,
            razorpay_order_id:razorOrder.id,
            receipt:razorOrder.receipt,
            amount:razorOrder.amount,
            currency:razorOrder.currency,
            status:"pending"
        })
        return res.json({
            key:process.env.RAZORPAY_KEY_ID,
            orderId:razorOrder.id,
            amount:razorOrder.amount,
            currency:razorOrder.currency,
            itemsCount:items.length
        })
    }catch(err){
        console.error("createOrder error:",err)
        return res.status(500).json({message:"order creation failed",error:err.message})
    }
}
const verifyPayment=async(req,res)=>{
    try{
        const{
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id
        }=req.body

     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    
    if (!isValid){
        await Order.updateOne(
            {razorpay_order_id},
            {status:"cancelled"}
        )
        return res.status(400).json({success:false,message:"invaild signature"})
    }

    //Mark order as paid
        await Order.updateOne(
            {razorpay_order_id},
            {
                status:"paid",
                razorpay_payment_id,
                paid_at:new Date()
            }
        )

    //clear cart after payment success
    if(user_id){
        await Cart.deleteMany({user_id})
    }
    return res.json({success:true})
    }catch(err){
        console.error("verify payment error:",err)
        return res.status(500).json({message:"verification failed",error:err.message})
    }
}

module.exports={createOrder,verifyPayment}



