import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import "./Cart.css"



const CartPage=()=>{
    const USER_ID = localStorage.getItem("userId");
    const navigate=useNavigate()

    const [cartItems,setCartItems]=useState([])

    const fetchCart=async()=>{
        const res=await fetch(`https://pranay-mern-ecommerce-mongodb.onrender.com/api/cart/${USER_ID}`)
        const data=await res.json()
        setCartItems(data)
    }
     useEffect(()=>{
            fetchCart()
        },[])

    const increaseQty=async(product_id)=>{
        const item=cartItems.find(i=>i.product_id._id===product_id)
        const newQty=item.qty+1
        
        await fetch("https://pranay-mern-ecommerce-mongodb.onrender.com/api/cart/update",{
            method:"PUT",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify({user_id:USER_ID,product_id,qty:newQty})
        })
        fetchCart()
    }
    const decreaseQty=async(product_id)=>{
        const item=cartItems.find(i=>i.product_id._id===product_id)
        const newQty=item.qty-1 
        await fetch("https://pranay-mern-ecommerce-mongodb.onrender.com/api/cart/update",{
            method:"PUT",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify({user_id:USER_ID,product_id,qty:newQty})
        })
       fetchCart()
    }
    const removeItem=async(product_id)=>{
         await fetch("https://pranay-mern-ecommerce-mongodb.onrender.com/api/cart/remove",{
            method:"DELETE",
            headers:{"content-Type":"application/json"},
            body:JSON.stringify({user_id:USER_ID,product_id})
        })
       fetchCart()
    }

    const clearCart=async()=>{
        await fetch (`https://pranay-mern-ecommerce-mongodb.onrender.com/api/cart/clear/${USER_ID}`,{
            method:"DELETE",
        })
        fetchCart()
    }

    const total=cartItems.reduce(
        (sum,item)=>sum+Number(item.product_id?.price || 0)*item.qty,0
    )
return(
        <>
        <div className="cart-wrap"> 
            <div className="cart-card" style={{padding:"20px"}}>
                <h2 className="cart-title">Your cart</h2>
                <p className="cart-subtitle">Item's added in your cart</p>
                <hr></hr>
                {cartItems.length==0?(
                    <p>Your cart is empty</p>
                ):(
                    <div className="cart-container" style={{maxWidth:"600px"}}>
                        {cartItems.map((item)=>(
                            <div className="cart-item" key={item._id}>
                                <div className="cart-info">
                                    <div className="cart-name"><b>{item.product_id.name}</b></div>
                                    <div className="qty-row"style={{marginTop:"5px",
                                                 display:"flex",
                                                 alignItems:"center",
                                                 gap:"10px"  
                                    }}>
                                        <button className="qty-btn" onClick={()=>decreaseQty(item.product_id._id)}>-</button>
                                                <span className="qty-value">{item.qty}</span>
                                        <button className="qty-btn" onClick={()=>increaseQty(item.product_id._id)}>+</button>
                                    </div>
                                    <div className="price" style={{marginTop:"5px"}}>₹ {Number(item.product_id.price).toFixed(2)}</div>
                                </div>
                                <div>
                                    <button 
                      onClick={() => removeItem(item.product_id._id)}
                      title="Remove item"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 20,
                        color: "#d9534f",
                      }}
                    ><i className="fa fa-trash" style={{ color: "#d9534f", fontSize: 18 }}></i></button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total">
                        <span>Total:</span>
                        <span>₹ {total.toFixed(2)}</span>
                        
                        </div>
                        <br></br>
                        <div className="cart-actions">
                        <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                        <button className="checkout-btn"
                                onClick={() => navigate("/checkout")}
                                >Proceed to Checkout</button></div>
                                </div>)}
                    <button className="back-btn" onClick={() => navigate("/dashboard")}>Back to Products</button>
                </div>
            </div>
        </>
    )
}
export default CartPage
