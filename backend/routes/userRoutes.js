const router = require('express').Router()

const {
    registerUser, 
    loginUser,
    logOutUser, 
    forgotPassword, 
    resetPassword,
    getUserDetails,
    updateUserPassword,
    updateUserProfile,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require("../controller/userController")

const {isAuthenticated,authorizeRoles} = require('../middlewares/auth')


router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/logout',logOutUser)

router.post('/password/forgot',forgotPassword)

router.put('/password/reset/:token',resetPassword)

router.get('/me',isAuthenticated,getUserDetails)

router.put('/password/update',isAuthenticated,updateUserPassword) 

router.put('/me/update',isAuthenticated,updateUserProfile) 

router.get('/admin/users',isAuthenticated,authorizeRoles("admin"),getAllUser)

router.get('/admin/user/:id',isAuthenticated,authorizeRoles("admin"),getSingleUser) 

router.put('/admin/user/:id',isAuthenticated,authorizeRoles("admin"),updateUserRole) 

router.delete('/admin/user/:id',isAuthenticated,authorizeRoles("admin"),deleteUser) 




module.exports = router