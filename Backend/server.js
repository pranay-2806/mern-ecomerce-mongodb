const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const connectDB=require("./db/connection")

dotenv.config()

const authRoutes=require("./routes/auth")
const productRoutes=require("./routes/products")
const cartRoutes=require("./routes/cart")
const razorpayRoutes=require("./routes/orders")

const app=express()


const allowedOrigins = [
  "http://localhost:5173",
  "https://pranay-mern-ecommerce-mongodb.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*",cors())

app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/razorpay",razorpayRoutes)

app.get("/",(req,res)=>{
    res.send("server is running...!")
})

const PORT=process.env.PORT || 5000
connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`server listening to the port ${PORT}`)
    })
})
.catch((err)=>{
    console.error("DB connection failed",err)
})