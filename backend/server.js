const app = require('./app')
const dotenv = require('dotenv')
const db = require('./database/db')
const cors = require('cors')
const cloudinary = require("cloudinary");



//handling uncaught error
process.on('uncaughtException',err=>{
    console.log(`Error:${err.message}`)
    console.log('Shutting down the server due to uncaughtException');

    process.exit(1)
})

// console.log(youtube)


//config

dotenv.config({path:'backend/config/config.env'})

//Using cors
const corsOptions = {
    credentials:true,
    origin:['http://localhost:3000']
}
app.use(cors(corsOptions))


//connecting to database
db()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server = app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})

//Unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`Error:${err.message}`)
    console.log('Shutting down the server due to unhandled promise rejection');

    server.close(()=>{
        process.exit(1)
    })
});