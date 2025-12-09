const pool=require("../db/connection")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const forgotPassword=async(req,res)=>{
    const {email}=req.body
    if(!email) return res.status(400).json({message:"email is required..!"})

    try{
        const [rows]=await pool.execute(
            "select id,username from users where email=? LIMIT 1",
            [email]
        )
        if(!rows.length){
            return res.status(200).json({message:"if the email exists, reset instructions were sent to your mail"})
        }
        const user=rows[0]

        const resetToken=jwt.sign(
            {id:user.id,username:user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"1h"}
        )
        return res.json({
            message:"password rest token created sent via email in products",resetToken
        })
        
    }catch(err){
        console.error("forgot password error:",err)
        return res.status(500).json({message:"failed to create reset token"})
    }
}
module.exports={forgotPassword}