const { 
    getAllProducts,
    getAdminProducts,
     createProduct ,
     getProductDetails ,
    updateProduct ,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controller/productController')

const {isAuthenticated,authorizeRoles} = require('../middlewares/auth')

const router = require('express').Router()


router.post('/admin/product/new',isAuthenticated,authorizeRoles("admin"),createProduct)

router.get('/products',getAllProducts)

router.get('/admin/products',isAuthenticated,authorizeRoles("admin"),getAdminProducts)

router.get('/product/:id',getProductDetails)

router.put('/admin/product/:id',isAuthenticated,authorizeRoles("admin"),updateProduct)

router.delete('/admin/product/:id',isAuthenticated,authorizeRoles("admin"),deleteProduct)

router.put('/review',isAuthenticated,createProductReview)

router.get('/reviews',isAuthenticated,getProductReviews)

router.delete('/reviews',isAuthenticated,deleteReview)


module.exports = router