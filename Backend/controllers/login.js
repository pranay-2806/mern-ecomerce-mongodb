const pool=require("../db/connection")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const login=async(req,res)=>{
    const{username,password}=req.body
    try{
        const [rows]=await pool.execute(
            "SELECT * FROM users WHERE username=? LIMIT 1",
            [username]
        )
        if(!rows.length) return res.json({"message":"invalid credentials"})

        const user=rows[0]

        const match=await bcrypt.compare(password,user.password)

        if(!match) return res.json({"message":"invaild credentials"})

        const token=jwt.sign(
            {id:user.id,username:user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"1d"}
        )
        res.json({"message":"login successful",token})
    }catch(err){
        res.status(500).json({"message":"login failed"})
    }   
}
module.exports={login}