const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../controllers/AuthController/verify")
const Product = require("../models/Product")



// get all product
router.get('/',asyncHandler(async(req,res,next)=>{
    console.log("get product");
    
    const {query,queryCategory}= req.query;
    
    let products;
    if(query){
        products=await Product.find().sort({createdAt:-1}).limit(5)
    }else if(queryCategory){
        products=await Product.find({categories:{
            $in:[queryCategory] 
        }})
    }
    else{
        products=await Product.find()
    }

    return res.status(200).json({message:"successfully fetched all matching products", products})
})) 


// get product
router.get('/find/:id',asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const {username,password,email,isAdmin}=req.body

    const product=await Product.findById(id);

    return res.status(200).json({message:"successfully fetchted",product})
}))
 

router.use(verifyToken)

 

router.post('/',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{

    const {...productDetails} = req.body;
    
    const newProduct= new Product(productDetails)
    console.log({productDetails,newProduct});

    const savedProduct = await newProduct.save()

    res.status(200).json({message:"Success",savedProduct});
}))



// Update
router.put('/:id',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{
    const {id} =req.params
    const {...productDetails} = req.body;
    
    const updatedProduct=await Product.findByIdAndUpdate({_id:id},{$set:productDetails},{new:true}) 
    return res.status(200).json({updatedProduct})
}))



// delete
router.delete('/:id',verifyTokenAndAdmin,asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const deletedProduct=await Product.findByIdAndDelete(id);
    return res.status(200).json({message:"Product successfully deleted",deletedProduct})
}))







module.exports=router