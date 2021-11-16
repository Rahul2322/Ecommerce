const express = require('express')
const app = express()

const errorMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser')

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv')


//config
dotenv.config({path:'backend/config/config.env'})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


//Routes import
const product = require('./routes/productRoutes')
const user = require('./routes/userRoutes')
const order = require('./routes/orderRoutes')
const payment = require('./routes/paymentRoute')





//Routes for products
app.use('/api/v1/',product);

//Routes for user
app.use('/api/v1/',user);

//Routes for order
app.use('/api/v1/',order);

//Routes for payment
app.use("/api/v1/",payment);

//Middleware for error
app.use(errorMiddleware)

module.exports = app