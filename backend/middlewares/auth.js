const jwt = require('jsonwebtoken')
const catchAsyncError = require('./catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const User = require('../models/userModel')

exports.isAuthenticated = catchAsyncError(async(req,res,next)=>{
   
    const {token} = req.cookies;
    // console.log(token)

    if(!token){
        return next(new ErrorHandler("You need to be a logged in person",401))
    }
    const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
    if(!verifyToken){
        return next(new ErrorHandler("You are not a authorised person ",403))
    }

    // req.user = await User.find({_id:verifyToken._id})
    //find method was giving an array

    req.user = await User.findById({_id:verifyToken._id})
    
    next()
    
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        console.log(roles,req.user)
        if(!roles.includes(req.user.role)){
            return next( new ErrorHandler(`Role:${req.user.role} has no access to this resource`,403))
        }
    
        next()

    }

   
}