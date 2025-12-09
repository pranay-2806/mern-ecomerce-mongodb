const pool=require("../db/connection")

const getProducts=async(req,res)=>{
    try{
        const [rows]=await pool.execute("SELECT * FROM products")
        res.json(rows)
    }catch(err){
        res.status(500).json({"message":err.message})
    }
}
module.exports={getProducts}