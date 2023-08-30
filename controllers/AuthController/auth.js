const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const User = require("../../models/Users")
const cryptojs=require("crypto-js")
const jwt=require("jsonwebtoken")


// Register route

router.post('/register',asyncHandler(async(req,res,next)=>{
    const {password,...userData}=req.body
    console.log({userData});
    const hashedPassowrd=cryptojs.AES.encrypt(password,process.env.CRYPTO_SECCRET).toString()
    console.log({hashedPassowrd});
     
    const newUser= await User.create({
        password:hashedPassowrd,...userData
    })
    // console.log({data})
    const {password:pw,...savedData}=newUser._doc
    res.status(201).json({success:true,savedData})
}))






// login route
router.post('/login',asyncHandler(async(req,res,next)=>{
    const {username,password}=req.body
    const user = await User.findOne({username});

    if(!user)
     return res.status(401).json({message:"no user found"})

    const hashedPassowrd = cryptojs.AES.decrypt(user.password,process.env.CRYPTO_SECCRET)
    const DecodedPassword=hashedPassowrd.toString(cryptojs.enc.Utf8);
    // console.log(DecodedPassword);
    
    if(DecodedPassword!==password){
        return res.status(401).json({message:"incorrect password"})
    }

    const accessToken=jwt.sign({
        id:user._id,isAdmin:user.isAdmin
    },process.env.jwtSecret,{expiresIn:"1d"})
    const {password:usrPasswrd,...toBeSent}=user._doc

    return res.status(200).json({message:"success",toBeSent,accessToken})
}))

module.exports=router
