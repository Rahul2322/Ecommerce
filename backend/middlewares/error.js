const ErrorHandler = require('../utils/errorHandler')



module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal Server error'

    //mogodb id error
    if(err.name === 'castError'){
        const message = `Resource not found.Error:${err.path}`
        err = new ErrorHandler(message,400)
    }

    //Mngodb duplication error

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyvalue)} Entered`
        err = new ErrorHandler(message,400)
    }

    //Wrong JWT token

    if(err.name === 'JsonWebTokenError'){
        const message = `Json web token is invalid, Try again`
        err = new ErrorHandler(message,400)
    }

    // JWT token expire error

    if(err.name === 'TokenExpireError'){
        const message = `Json web token is expired,try again`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message //err.stack gives the location of error
    })
}