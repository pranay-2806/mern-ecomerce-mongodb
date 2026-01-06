const bcrypt=require("bcryptjs")
const User=require("../models/users")

const register=async(req,res)=>{
    const{username,email,password}=req.body
    try{
        const existing=await User.findOne({username})
        if(existing) return res.json({message:"user already exists"})

        const hash=await bcrypt.hash(password,10)

        await User.create({
            username,
            email,
            password: hash
        })
        res.json({message:"registration sucessfull"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"registration failed"})
    }
}
module.exports={register}

