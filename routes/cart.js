const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../controllers/AuthController/verify")
const Cart = require("../models/Cart")

router.use(verifyToken)



router.post('/',asyncHandler(async(req,res,next)=>{    
    const newCart= new Cart(productDetails)
    console.log({productDetails,newCart});

    const cartProduct = await newCart.save()

    res.status(200).json({message:"Success",cartProduct});
}))



// Update
router.put('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id} =req.params
    const {...productDetails} = req.body;
    
    const updatedCart=await Cart.findByIdAndUpdate({_id:id},{$set:productDetails},{new:true}) 
    return res.status(200).json({updatedCart})
}))



// delete
router.delete('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const deletedCart=await Cart.findByIdAndDelete(id);
    return res.status(200).json({message:"Product successfully deleted",deletedCart})
}))


// get user cart
router.get('/find/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id}=req.params

    const cart=await Cart.findOne({userId:id});
    return res.status(200).json({message:"successfully fetchted",cart})
}))


// get all 
router.get('/',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{

    
    let cart;
    cart=await Cart.find()
   
    return res.status(200).json({message:"successfully fetched all carts", cart})
})) 



module.exports=router