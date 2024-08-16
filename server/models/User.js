const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now
    },
    Description:{
       type:String,

    },
    phonenumber:{
        type:Number,
        required:true
    },
})
const UserModel = mongoose.model("users" , UserSchema)
module.exports=UserModel