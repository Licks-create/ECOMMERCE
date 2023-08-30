const mongoose=require("mongoose")

const userSchema=mongoose.Schema(
    {
    firstName:{type:String},
    lastName:{type:String},
    username:{type:String,required:true,unique:true},
    emailId:{type:String,required:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
    img:{type:String},
    },
    {
        timestamps:true
    }
)

module.exports=mongoose.model('Users',userSchema)