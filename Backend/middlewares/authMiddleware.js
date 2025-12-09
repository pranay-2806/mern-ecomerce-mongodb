const jwt=require("jsonwebtoken")

// Middleware to protect routes
const authMiddleware=(req,res,next)=>{
    // 1. Read the Authorization header sent from frontend
    const authHeader=req.headers.authorization

    // 2. If header is missing → user didn't send token
    if(!authHeader){
        return res.status(401).json({"message":"no token provided"})
    }

    // 3. Extract only the token from "Bearer <token>"
    const token=authHeader.split(" ")[1]

    try{
        // 4. Verify token using your secret key
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    
        // 5. Attach decoded user info to req.user
        req.user=decoded

        // 6. Allow request to continue to the controller
        next()
    }catch(err){
        // If token is fake, expired, or tampered with → block request
        return res.status(401).json({"message":"invaild token"})
    }
    
}
module.exports=authMiddleware