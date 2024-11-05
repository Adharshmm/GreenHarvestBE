const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the event
        ref: 'users', // Reference to the User model
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const events = mongoose.model('events',eventSchema)
module.exports = events
