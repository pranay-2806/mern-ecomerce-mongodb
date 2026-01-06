const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const User=require("../models/users")

const login=async(req,res)=>{
    const{username,password}=req.body

    try{
        //find by username
        const user=await User.findOne({username}).lean()
        //
        if(!user) return res.json({message:"invalid credentials"})
        //compare username
        const match=await bcrypt.compare(password,user.password)

        if(!match) return res.json({message:"inavalid credentials"})

        //create token
        const token=jwt.sign(
            {id:user._id,username:user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"1d"}
        )
        //login sucess
        res.json({message:"login sucessful",token})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"login failed"})
    }
}
module.exports={login}





