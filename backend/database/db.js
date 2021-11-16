const mongoose = require('mongoose')



const db = ()=>{
    mongoose.connect(process.env.DB_URI,{useNewURLParser:true,useUnifiedTopology:true})
        .then(data=>console.log('Database connected...'))
        // .catch(err=>console.log(err)) handled in server.js file
}

module.exports = db