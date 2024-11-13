const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
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
    quantity: {
        type: Number,
        min: 0,
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved',"rejected"], 
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


itemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const items = mongoose.model('items', itemSchema);

module.exports = items;
