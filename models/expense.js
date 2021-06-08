const mongoose = require('mongoose')
const date = new Date()
const month = date.getMonth()
const year = date.getFullYear()
const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number
    },
    recipient: {
        type: String
    },
    date: {
        type: String,
    },
    employee:{
        type: String
    },
    description: {
        type: String
    },
    month: {
        type: String,
        default: month
    },
    year:{
        type: Number,
        default: year
    },
    receiptnumber: {
        type: String
    },
    department: {
        type: String
    }
})

module.exports = mongoose.model('expense', expenseSchema)