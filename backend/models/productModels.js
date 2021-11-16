const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:[true,"Please enter price of the product"],
        maxlength:[8,"price cannot exceed 8 chracters"]
    },
    description:{
        type:String,  
        required:[true,"Please enter product description"],
       
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    }

    
],

    category:{
        type:String,
        required:[true,'Please enter product category']
    },

    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxlength:[4,"stock cannot exceed 4 characters"]
    },

    numOfReviews:{
        type:Number,
        default:0

    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },

            comments:{
                type:String,
                required:true
            }
        }

    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
})


module.exports = mongoose.model('Product',productSchema)