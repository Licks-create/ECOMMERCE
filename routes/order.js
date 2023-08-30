const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../controllers/AuthController/verify")
const Order = require("../models/Order")
const Product = require("../models/Product")

router.use(verifyToken)


// create
router.post('/',asyncHandler(async(req,res,next)=>{

    const {...orderDetails} = req.body;
    
    const newOrder= new Order(orderDetails)
    console.log({orderDetails,newOrder});
 
    const OrderProduct = await newOrder.save()

    res.status(200).json({message:"Success",OrderProduct});
})) 



// Update
router.put('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id} =req.params
    const {...productDetails} = req.body;
    
    const updatedOrder=await Order.findByIdAndUpdate({_id:id},{$set:productDetails},{new:true}) 
    return res.status(200).json({updatedOrder})
}))



// delete
router.delete('/:id',verifyTokenAndAdmin ,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const deletedOrder=await Order.findByIdAndDelete(id);
    return res.status(200).json({message:"Order successfully deleted",deletedOrder})
}))


// get user Order
router.get('/find/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id}=req.params

    const Order=await Order.find({userId:id});
    return res.status(200).json({message:"successfully fetchted",Order})
}))


// get all 
router.get('/',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{

    
    let Orders =await Order.find()
   
    return res.status(200).json({message:"successfully fetched all Orders", Orders})
})) 



// get monthly income

router.get('/income',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{
    const productId=req.query.pid
    const date=new Date()
    const lasMonth=new Date(date.setMonth(date.getMonth()-1))
    const preMonth= new Date(new Date().setMonth(lasMonth.getMonth()-1))

    const income=await Order.aggregate([
        {$match:{createdAt:{$gte:preMonth},...(
            productId && {products:{$elemMatch:{productId:productId}}} 
            )}},
        {
            $project:{
                mon:{$month:"$createdAt"},
                sales:"$amount"
            }
        },
        {
            $group:{
                _id:"$mon",//_id:expression,
                total:{$sum:"$sales"}
            }

        }
    ])
    console.log({income});
    return res.status(200).json({message:"income stats",income})
}))

module.exports=router