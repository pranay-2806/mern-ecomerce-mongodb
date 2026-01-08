import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import "./Dashboard.css"

const Dashboard=()=>{
    const navigate=useNavigate()
    const [cartcount,setCartcount]=useState(0)
    
    const [products,setProducts]=useState([])
    useEffect(()=>{
    alert("Welcome to Dashboard")    

        const fetchProducts=async()=>{
            try{
                const token=localStorage.getItem("token")
                if(!token){
                    alert("no token found, please login again")
                    navigate("/")
                    return
                }
                const res=await axios.get("https://pranay-mern-ecomerce-mongodb.onrender.com/api/product",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                console.log("Product response:",res.data)

                setProducts(res.data)
            }catch(err){
                console.error("Error fetching products:",err)
                if(err.response?.status==401){
                    alert("session expired please login again")
                    navigate("/")
                }else{
                alert("failed to load products")
                }   
            }
        }
        fetchProducts()
    },[navigate])

    const addtocart=async(product)=>{
        try{
            const userId=localStorage.getItem("userId")

            console.log("USER ID:",userId)
            console.log("PRODUCT ID:",product._id)

            const res=await fetch("https://pranay-mern-ecomerce-mongodb.onrender.com/api/cart/add",{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({user_id:userId,product_id:product._id
                })
            })
            if (!res.ok) {
                console.error("Backend returned error");
                alert("Failed to add to cart!");
                return;
            }
            setCartcount((prev)=>prev+1)
            alert("added to cart!")
            }catch(err){
                console.error("add to cart error",err)
                alert("failed to add!")
            }
        }

    return(
        <>
            <div className="dash-wrap">
                <div className="dash-card">
                    <div className="dash-header">
                        <div>
                            <h2>DashBoard</h2>
                            <p>welcome</p>
                        </div>
                        <div className="header-buttons">
                            <button className={`cart ${cartcount>0 ? "cart-active":" "}`}
                                onClick={() => navigate("/cart")}><i className="fa fa-shopping-cart"></i>
                                {cartcount>0 && (<span className="cart-badge">{cartcount}</span>)}</button>
                            <button className="logout"
                            onClick={()=>navigate("/")}>LogOut</button>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="product-header">
                    <h3>Products</h3>
                    </div>
                    <ul className="product-list">
                        {products.length > 0 ? (
                        products.map((product) => (<li className="product-card" key={product._id}
                        style={{
                            listStyle: "none",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "16px",
                            maxWidth: "320px"}}>
                        <img src={product.product_img} 
                            alt={product.name}
                            style={{width:"100%",
                                    height:"200px",
                                    objectFit:"cover",
                                    borderRadius: "6px",
                                    display: "block"}}></img>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">
                            <b>Price:</b> ₹{product.price}
                        </p>
                        <p className="product-desc">{product.description}</p>
                        <button
                    className="add-cart-btn"
                    onClick={() => addtocart(product)}>
                    <i className="fa fa-cart-plus"></i> Add to Cart
                  </button>
                        </li>   
                        ))
                        ) : (
                        <li>Loading...</li>
                         )}
                         
                    </ul>
                    
                </div>
            </div>
        </>
    )
}
export default Dashboard