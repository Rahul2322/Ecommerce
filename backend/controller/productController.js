const Product = require('../models/productModels')
const catchAsyncError = require('../middlewares/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')
const ErrorHandler = require('../utils/errorHandler')
const cloudinary = require("cloudinary")

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});



// Get All Product
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
 
   //Here iam grabbing all the products based on above query before pagination to show pagination or not 
   //on  based on count

   let filteredProductsCount = products.length

   apiFeature.pagination(resultPerPage)

// products = await apiFeature.query
    
    if(!products){
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({
        succes:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
});


// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req,res,next)=>{
    const products = await Product.find();

    res.status(200).json({
        products,
        success:true
    })
})

// Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
  });

// Update Product -- Admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    
   let product = await Product.findById(req.params.id)


    if(!product){
        return next(new ErrorHandler(404,"Product not found"))
    }
    let images = []
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
    if(images !== undefined){
        for(let i=0;i<product.images.length;i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks=[]
        for(let i=0;i<images.length;i++){
           const result =  await cloudinary.v2.uploader.upload(images[i],{
                folder:"products"
            });
            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
        }
        
        req.body.images = imagesLinks
    }
   

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json(product)
})


exports.deleteProduct =catchAsyncError( async(req,res,next)=>{
    
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler(404,"Product not found"))
    }

    //Deleting images from cloudinary

    for(let i= 0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
   await product.remove()
    res.status(200).json({
        success:true
    })
});

exports.createProductReview  = catchAsyncError(async (req,res,next)=>{

    const {rating ,comments ,productId} = req.body

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comments

    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=>rev.user.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating,
                rev.comments = comments
            };
        });

    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

  let avg =0;

 product.reviews.forEach(rev=> avg+=rev.rating);

 product.ratings = avg/product.reviews.length;

 await product.save({validateBeforeSave:false});

 res.status(200).json({
     success:true
 });

    
});


//Get All reviews of a product

exports.getProductReviews = catchAsyncError(async (req,res,next)=>{
    const product  =  await Product.findById(req.query.id) 

    if(!product){
        return next(new ErrorHandler(404,"Product not found"))
    }

    res.status(200).json({
        succes:true,
        reviews:product.reviews
    });
});


//Delete reviews Of a product

exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler(404,"Product not found"));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
