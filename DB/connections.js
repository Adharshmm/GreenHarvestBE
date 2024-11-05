const mongoose = require('mongoose')
const connection_string = process.env.MONGO_URL

mongoose.connect(connection_string).then((res)=>{
    console.log("DB connected successfully")
}).catch((error)=>{
    console.log('connection Failed')
    console.log(error)
})