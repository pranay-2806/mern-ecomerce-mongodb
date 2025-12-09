const Razorpay = require("razorpay")
const crypto=require("crypto")
const pool=require("../db/connection")

const rzp=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

const getCartForUser=async(userId)=>{
    const [rows]=await pool.query(
        `SELECT c.product_id,c.qty,p.name,p.price,p.product_img FROM carts c 
         JOIN products p ON c.product_id=p.id 
         WHERE c.user_id=?`,[userId]
    )
    return rows;
}

const createOrder=async(req,res)=>{
    try{
        const{user_id}=req.body

        if(!user_id){
            return res.status(400).json({Message:"user_id required"})
        }
        const items=await getCartForUser(user_id)

        if(!items || items.length === 0){
            return res.status(400).json({message:"Cart is empty"})
        }
        const total=items.reduce(
            (sum,item)=>sum+Number(item.price)*Number(item.qty),0
        )
        const amountInPaise=Math.round(total*100)
        
        const razorOrder=await rzp.orders.create({
            amount:amountInPaise,
            currency:"INR",
            receipt:`rcpt_${Date.now()}`,
            payment_capture:1
        })
        await pool.query(`INSERT into orders(user_id,order_id,receipt,items,amount,currency,status)
            VALUES(?,?,?,?,?,?,?)`,[
                user_id,
                razorOrder.id,
                razorOrder.receipt,
                JSON.stringify(items),
                razorOrder.amount,
                razorOrder.currency,
                "created",
            ])
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

//verify razorpay payment
const verifyPayment=async(req,res)=>{
    try{
        const{
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
        }=req.body
        
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(400).json({message:"Missing required fields"})
        }

        const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
                                      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                                      .digest("hex")
        const isValid=expectedSignature===razorpay_signature

        if(!isValid){
            await pool.query("UPDATE orders SET status=? WHERE order_id=?",
                ["failed",razorpay_order_id])
            return res.status(400).json({success:false,message:"invalid signature"})
        }

        //update order as paid
        await pool.query(
            `UPDATE orders SET status=?,razorpay_payment_id=?,paid_at=? WHERE order_id=?`,
            ["paid",razorpay_payment_id,new Date(),razorpay_order_id]
        )

        //clear cart
        if(user_id){
            await pool.query("DELETE FROM carts WHERE user_id=?",[user_id])
        }

        return res.json({success:true})
    }catch(err){
        console.error("verify payment error:",err)
        return res.status(500).json({message:"verification failed",error:err.message})
    }
}

module.exports={createOrder,verifyPayment}

