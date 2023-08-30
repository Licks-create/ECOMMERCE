const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const cryptojs=require("crypto-js")
const jwt=require("jsonwebtoken")
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../controllers/AuthController/verify")
const User = require("../models/User")

router.use(verifyToken)

// Update
router.put('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const {username,password,email,isAdmin}=req.body
    if(password){
        req.body.password=cryptojs.AES.encrypt(password,process.env.CRYPTO_SECCRET).toString();
    }
    const update=await User.findByIdAndUpdate({_id:id},{$set:{password:req.body.password,isAdmin,email,username}},{new:true}) 
    return res.status(200).json({update})
}))



// delete
router.delete('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const deletedUser=await User.findByIdAndDelete(id);
    return res.status(200).json({message:"successfully deleted",deletedUser})
}))







// get
router.get('/find/:id',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const {username,password,email,isAdmin}=req.body

    const user=await User.findById(id).select("-password");

    return res.status(200).json({message:"successfully deleted",user})
}))









// get all user
router.get('/',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{

    const query= req.query.new;
    
    const users= query
    ? await User.find().sort({_id:-1}).select("-password")
    : await User.find().select("-password");

    return res.status(200).json({message:"successfully deleted",users})
})) 






// get user status
router.get('/stats',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1))
    const data=await User.aggregate([
        {$match:{createdAt:{$gte:lastYear}}},
        {
            $project:{
                mon:{$month:"$createdAt"}
            }
        },
        {
            $group:{
                _id:"$mon",//_id:expression,
                total:{$sum:1}
            }

        }
    ])
    console.log({data});
    return res.status(200).json({data})
}))







module.exports=router