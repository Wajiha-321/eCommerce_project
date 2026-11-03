import mongoose, { model } from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    profilePic:{
        type:String
    },
    profilePicPublicId:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    token:{
        type:String,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:String,
        default:false
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiry:{
       type:Date,
       default:null
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    zipCode:{
        type:String
    },
    phoneNo:{
        type:String
    }
}, {timestamps: true})

const userModel = mongoose.model("userModel", userSchema)

export default userModel