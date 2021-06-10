const mongoose = require('mongoose')

const expensemonthSchema = new mongoose.Schema({
        year: {
            type: Number
        },
        jan: {
            type: Number
        },
        feb: {
            type: Number
        },
        mar: {
            type: Number
        },
        apr: {
            type: Number
        },
        may:{
            type: Number
        },
        jun: {
            type: Number
        },
        jul: {
            type: Number
        },
        aug:{
            type: Number
        },
        sep:{
            type: Number
        },
        oct: {
            type: Number
        },
        nov: {
            type: Number
        },
        dec: {
            type: Number
        }
    
})

module.exports = mongoose.model('expensemonths', expensemonthSchema)