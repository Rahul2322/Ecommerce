const catchAsyncError = require('../middlewares/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')
const User = require('../models/userModel')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendMail')
const ErrorHandler = require('../utils/errorHandler')
const crypto = require('crypto')
const cloudinary = require('cloudinary')


//Register user
exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name ,email ,password} = req.body

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    });

    const user  = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    })
    
     sendToken(user,201,res)
    // const token = user.getJWTToken()
    // res.status(201).json({
    //     succes:true,
    //     token
    // })
})

//Login user
exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email ,password} = req.body

    if(!email || !password){
       return  next(new ErrorHandler("All fields are required",400))
    }

    const user = await User.findOne({email}).select("+password") //bcoz we have made password select false in model
    //There has to be findOne and not find 

    if(!user){
        return next(new ErrorHandler("Invalid email or password",403))
    }
   
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",403))
    }

  sendToken(user,200,res)

})

//Logout the user

exports.logOutUser= catchAsyncError(async (req,res,next)=>{
res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
})

    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})

//Forgot password

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

     if(!user){
        return next(new ErrorHandler("Invalid email or password",403))
    }

    //Get ResetPasswordToken
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is:-\n\n ${resetPasswordUrl}\n\n If you have not requested this email please ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject:"Ecommerce Password Recovery",
            message,
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetpasswordExpire = undefined;
        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500))
    }
});


//Reset Password

exports.resetPassword = catchAsyncError(async (req,res,next)=>{
    //create token hash
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetpasswordExpire:{$gt:Date.now()} //means saved resetpassword time is greater than Date.now()
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",400))
    }

    if(req.body.password !== user.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save()
 
    sendToken(user,200,res)


})

//Get user details
exports.getUserDetails = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success:true,
        user,
    })

})


//update user password
exports.updateUserPassword = catchAsyncError(async (req,res,next)=>{
    
    
    const user = await User.findById(req.user._id).select("+password")

    //here i was trying to find user without select password hence bcrypt has nothong to compare and hence error

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
      
    
    console.log(isPasswordMatched)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }

    user.password = req.body.newPassword

    await user.save()
    
    sendToken(user,200,res)

});

//update user profile
exports.updateUserProfile = catchAsyncError(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    if(req.body.avatar!==''){
        const user = await User.findById(req.user._id)

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        });

        newUserData.avatar ={
            public_id:myCloud.public_id,
            url:myCloud.secure_url

        };
    }

    const user = await User.findByIdAndUpdate(req.user._id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });

  });


  //Get AllUser Details (admin)

  exports.getAllUser = catchAsyncError(async (req,res,next)=>{
      const users = await User.find()

      res.status(200).json({
          success:true,
          users
      })
  })


   //Get SingleUser Detail (admin)

   exports.getSingleUser = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("User not found!",400))
    }

    res.status(200).json({
        success:true,
        user
    })
});



//update user role --admin
exports.updateUserRole = catchAsyncError(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });

  });


  
//Delete User --admin
exports.deleteUser = catchAsyncError(async (req,res,next)=>{
   
    

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`,400))
    }

    let imageId = user.avatar.public_id

    await cloudinary.v2.uploader.destroy(imageId)

    await user.remove()

    res.status(200).json({
        success:true,
        message:"Delted successfully"
    });

  });

