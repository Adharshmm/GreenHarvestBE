const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    imageUrl:{
        type:String,
    },
    quantity:{
        type:Number,
        required:true,
        default: 0
    },
    grandTotal:{
        type:Number,
        required:true
    }
})

const carts = mongoose.model("carts",cartSchema)
module.exports = carts

