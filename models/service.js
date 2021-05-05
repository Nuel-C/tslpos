const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    session: {
        type: String
    },
    price: {
        type: Number
    },
    customer: {
        type: String
    },
    date: {
        type: String,
    },
    copies: {
        type: Number
    },
    discount: {
        type: Number
    },
    employee:{
        type: String
    },
    phone:{
        type: Number
    },
    aprice: {
        type: Number
    },
    department: {
        type: String
    }
})

module.exports = mongoose.model('service', serviceSchema)