const Order = require('../models/orderModel')
const Product = require('../models/productModels')
const catchAsyncError = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')


//Create new order

exports.newOrder = catchAsyncError(async (req,res,next)=>{

    const {
        shippingInfo,
        paymentInfo,
        orderItems,
        taxPrice,
        shippingPrice,
        itemsPrice,
        totalPrice

    } = req.body

    const order = await Order.create({
        shippingInfo,
        paymentInfo,
        orderItems,
        taxPrice,
        shippingPrice,
        itemsPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });
    res.status(201).json({
        success:true,
        order
    })
})


//Get single user order
exports.getSingleOrder = catchAsyncError(async (req,res,next)=>{

    const order = await Order.findById(req.params.id)
    .populate("user","name email")

    if(!order){
        return next(new ErrorHandler(`No order found with this ${req.params.id} id `,404))
    }

    res.status(200).json({
        success:true,
        order
    })
})



//Get logged in user orders
exports.myOrders = catchAsyncError(async (req,res,next)=>{

    const orders = await Order.find({user:req.user._id})

    res.status(200).json({
        success:true,
        orders
    })
})  

//Get All Orders --Admin

exports.getAllOrders = catchAsyncError(async (req,res,next)=>{

    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    }
        );



    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

//update Order status --Admin

exports.updateOrder = catchAsyncError(async (req,res,next)=>{

    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler(`No order found with this ${req.params.id} id `,404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler(`You have already delivered this order `,400))
    }

   if(req.body.status === "Shipped"){
       //Only if its shipped then only reduce qty 
    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.qty)
    })
   }

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true
    });

});

async function updateStock(id,qty){
    const product = await Product.findById(id);

    product.stock = product.stock - qty;

    await product.save({validateBeforeSave:false});
}


//Delete order --Admin

exports.deleteOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }

    await order.remove()

    res.status(200).json({
        success:true
    });
});