const app=require("express")()

function errHandler(err,req,res,next){
    
    return res.status(404).json({message:"error hanling",error:err.message})
}
module.exports={
    errHandler
}