import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css"
import axios from "axios";

const API_BASE = "https://pranay-mern-ecommerce-mongodb.onrender.com";


const Checkout = () => {
  const USER_ID = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // load cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/cart/${USER_ID}`);
      const data = res.data || [];
      setCart(data);
      const t = data.reduce((s, it) => s + Number(it.product_id?.price || 0) * Number(it.qty || 0), 0);
      setTotal(t);
    } catch (err) {
      console.error("fetchCart error:", err);
      alert("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handler: verifies payment with backend
  const handler = async (response) => {
    try {
      setLoading(true);
      const verifyRes = await axios.post(`${API_BASE}/api/razorpay/verify`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        user_id: USER_ID,
      });

      if (verifyRes.data && verifyRes.data.success) {
        // success — go to success page
        navigate("/order-success");
        navigate("/dashboard")
      } else {
        console.error("verify failed:", verifyRes.data);
        alert("Payment verification failed");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      alert("Payment verification error");
    } finally {
      setLoading(false);
    }
  };

  // loads Razorpay script if not already present
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setLoading(true);

      // 1) create order on backend (backend calculates amount)
      const orderRes = await axios.post(`${API_BASE}/api/razorpay/order`, { user_id: USER_ID });
      const orderData = orderRes.data;

      if (!orderData || !orderData.orderId) {
        console.error("Order creation failed:", orderData);
        alert(orderData.message || "Order creation failed");
        setLoading(false);
        return;
      }

      // 2) load script
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Failed to load Razorpay script");
        setLoading(false);
        return;
      }

      // 3) set options and open checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My Shop",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: handler, // use the arrow-function handler defined above
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("handlePayment error:", err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrap">
      <div className="checkout-card">
      <h2 classname="checkout-title">Checkout</h2>

      {cart.length === 0 ? (
        <p className="empty-message">Your cart is empty</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cart.map((it) => (
              <li key={it._id} className="checkout-item">
                <img
                  src={it.product_id?.product_img}
                  alt={it.product_id?.name}
                  className="product-img"
                />
                <div className="product-info">
                <strong className="prodcut-name">{it.product_id?.name}</strong> 
                <span className="prodcut-meta">— ₹{it.product_id?.price} × {it.qty}</span>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="checkout-total">Total: ₹{total.toFixed(2)}</h3>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="pay-btn">
            {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
          </button>
        </>
      )}
      </div>
    </div>
  );
};

export default Checkout;
