const router = require("express").Router()
const {processPayment,sendStripeApiKey} = require("../controller/paymentController")
const {isAuthenticated} = require("../middlewares/auth")

router.post("/payment/process",isAuthenticated,processPayment)
router.get("/stripeapikey",isAuthenticated,sendStripeApiKey)


module.exports = router;