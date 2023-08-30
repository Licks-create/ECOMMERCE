const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const User = require("../../models/User")
const cryptojs=require("crypto-js")
const jwt=require("jsonwebtoken")

const verifyToken=asyncHandler(async(req,res,next)=>{
    const authHeader=req.headers.token;
    // console.log(authHeader);

    const token=authHeader.split(" ")[1];
    
    if(authHeader){
       const verified=await jwt.verify(token,process.env.jwtSecret)
       console.log({verified})
       req.user= verified;
       next()
    }
    else{
        return res.status(401).json({message:"You are UNAUTHORIZED"});
    }
})


const verifyTokenAndAuthorization=asyncHandler(async(req,res,next)=>{
    const {id,userId}=req.params
    if(id===req.user.id|| userId===req.user.id || req.user.isAdmin)
     return  next()
    return next(new Error("Unauthorized access"))
})


const verifyTokenAndAdmin=asyncHandler(async(req,res,next)=>{
   console.log(req.user)
    if(req.user.isAdmin)
     return  next()
    else
    return next(new Error("ONLY ADMIN ACCESS"))
})
module.exports={
    verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin
}