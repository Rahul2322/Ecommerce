const router = require('express').Router()
const { 
    newOrder ,
    myOrders, 
    
    getSingleOrder ,
    getAllOrders ,
    updateOrder,
    deleteOrder
} = require('../controller/orderController')

const {isAuthenticated,authorizeRoles} = require('../middlewares/auth')

router.post('/order/new',isAuthenticated,newOrder)

router.get('/orders/me',isAuthenticated,myOrders)

router.get('/order/:id',isAuthenticated,getSingleOrder)

router.get('/admin/orders',isAuthenticated,authorizeRoles("admin"),getAllOrders)

router.put('/admin/order/:id',isAuthenticated,authorizeRoles("admin"),updateOrder)

router.delete('/admin/order/:id',isAuthenticated,authorizeRoles("admin"),deleteOrder)


module.exports = router