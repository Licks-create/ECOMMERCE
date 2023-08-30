const mongoose=require("mongoose")

const orderSchema=mongoose.Schema(
    {
    userId:{type:String,required:true},
    products:[
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default:1                
            }
        },
    ],
    //it contains multiple line information
    status:{type:String,default:"pending"}
    },
    {
        timestamps:true
    }
)
 
module.exports=mongoose.model('Order',orderSchema)