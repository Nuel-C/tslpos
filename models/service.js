const mongoose = require('mongoose')
const date = new Date()
const year = date.getFullYear()
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
    month:{
        type: String
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
        type: String
    },
    aprice: {
        type: Number
    },
    department: {
        type: String
    },
    receipt: {
        type: String
    },
    year:{
        type: Number,
        default: year
    }
})

module.exports = mongoose.model('service', serviceSchema)