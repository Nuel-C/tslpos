const mongoose = require('mongoose')

const admin = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,  
    }
})

module.exports = mongoose.model('Admin', admin)