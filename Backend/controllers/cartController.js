const pool=require("../db/connection")

const getCart=async(req,res)=>{
    try{
        const userId=req.params.userId
        const [rows]=await pool.query("SELECT c.id, c.user_id, c.product_id,c.qty,p.name,p.price,p.product_img FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?",
            [userId])
        return res.json(rows)
    }catch(err){
        console.log("Get cart error:",err)
        return res.status(500).json({message:"Failed to get cart"})
    }
}
const addToCart=async(req,res)=>{
    try{
        const{user_id,product_id}=req.body
        const[existing]=await pool.query("SELECT * FROM carts WHERE user_id=? AND product_id=?",[user_id,product_id])

        if(existing.length>0){
            
            const newQty=existing[0].qty+1

            await pool.query("UPDATE carts SET qty=? WHERE user_id=? AND product_id=?",[newQty,user_id,product_id])

            return res.json({...existing[0],qty:newQty})
        }
        const[result]=await pool.query("INSERT INTO carts (user_id,product_id,qty) VALUES (?,?,?)",
                    [user_id,product_id,1])
        return res.json({id:result.insertId,
                                  user_id,
                                  product_id,
                                  qty:1})
}catch(err){
        console.error("Add cart error:",err)
        return res.status(500).json({message:"Failed to add to cart"})
    }
}
const updateQty=async(req,res)=>{
    try{
        const{user_id,product_id,qty}=req.body
       await pool.query("UPDATE carts SET qty=? WHERE user_id=? AND product_id=?",
                        [qty,user_id,product_id])
        return res.json({message:"Quantity updated"})
    }catch(err){
        console.error("Update qty error:",err)
        return res.status(500).json({message:"failed to update quantity"})
    }
}
const removeItem=async(req,res)=>{
    try{
        const{user_id,product_id}=req.body
        await pool.query("DELETE FROM carts WHERE user_id = ? AND product_id = ?",
                            [user_id, product_id]);
        return res.json({message:"Item removed"})
    }catch(err){
        console.error("Remove item error:",err)
        return res.status(500).json({message:"Failed to remove item"})
    }
}
const clearCart=async(req,res)=>{
    try{
        const user_id=req.params.userId
        await pool.query("DELETE FROM carts WHERE user_id=?",[user_id])
        return res.json({message:"Cart cleared"})
    }catch(err){
        console.error("clear cart error:",err)
        return res.status(500).json({message:"Failed to clear cart!"})
    }
}
module.exports={getCart,addToCart,updateQty,removeItem,clearCart}