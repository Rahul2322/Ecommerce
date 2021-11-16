const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxlength:[30,"Name cannot be more than 30 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,  
        required:[true,"Please enter your password"],
        minlength:[8,"Password should be greater than 8 characters long"],
        select:false
       
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },

    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,


},{
    timestamps:true
});

//Password hash
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//JWT token
userSchema.methods.getJWTToken = function(){
   return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.EXPIRE
    })
}
//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

 // Generating passwordResetToken

 userSchema.methods.getResetPasswordToken = function(){

 const resetToken = crypto.randomBytes(64).toString("hex")

 //Hashing and adding resetPaswordToken in user Schema
 this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

 this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

 return this.resetToken;

 }
 
 

module.exports = mongoose.model('User',userSchema)