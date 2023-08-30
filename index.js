require('dotenv').config();
const express=require("express")
const app=express()  
const mongoose=require("mongoose");
const {errHandler} = require("./controllers/errHandler")
const morgan=require("morgan")  
const authRoute=require("./controllers/AuthController/auth")
const userRoute=require("./routes/user")
const productRoute=require("./routes/product")
const orderRoute=require("./routes/order")
const cartRoute=require("./routes/cart")
const stripeRoute=require("./routes/stripe")
const cors=require("cors")
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())



// database connection
mongoose.connect(process.env.Mongo_Url).then(x=>{
    console.log("mongoose connected")
}).catch(err=>{
    console.log("error")
})


app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/products",productRoute)
app.use("/api/orders",orderRoute)
app.use("/api/cart",cartRoute)
app.use("/api/stripe",stripeRoute)


app.get('/',(req,res,next)=>{
    // console.log("home page api");
    
    res.status(200).json({message:"api working successful"})
})
app.use(errHandler)
 


app.listen(process.env.PORT||5000,()=>{
    console.log("application server is running")
}) 