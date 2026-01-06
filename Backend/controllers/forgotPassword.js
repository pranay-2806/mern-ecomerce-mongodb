const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const User=require("../models/cart")

const forgotPassword=async(req,res)=>{
    const {email}=req.body
    if(!email)
    return res.status(400).json({message:"email is required..!"})
    try{
        //find user by email
        const user=await User.findOne({email}.lean())
        if(!user){
            return res.status(200).json({message:"if the email exists, reset instructions were sent to your mail "})
        }
        const resetToken=jwt.sign({id:user._id,username:user.username},
                        process.env.JWT_SECRET_KEY,
                        {expiresIn:"1h"}
                    )
                    return res.json({message:"password reset token created and (in real apps) sent via email",resetToken})
    }catch(err){
        console.error("forgot password error:",err)
        return res.status(500).json({message:"failed to create reset token"})
    }
}
module.exports={forgotPassword}




