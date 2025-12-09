const pool=require("../db/connection")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const register=async(req,res)=>{
    const{username,email,password}=req.body
    try{
        const hashed=await bcrypt.hash(password,10)

        const [result]=await pool.execute(
            "INSERT into users(username,email,password) values (?,?,?)",[username,email,hashed]
        )
        const token=jwt.sign(
            {id:result.insertId,username},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"1d"}
        )
        res.status(200).json({"message":"registerd successfully",token})
    }catch(err){
        res.status(500).json({"message":"Registration failed"})
    }
}
module.exports={register}


