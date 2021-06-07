const service = require("../models/service")
const months = require('../models/months')


function updateMonth(){
    //Jan
    service.find({ 
        date : {
        '$gte': 'January 1, 2021',
        '$lte': 'January 31, 2021'
        } 
        }, function(err, jan){
            var month = 0
            for(var i = 0; i < jan.length; i++){
                month += jan[i].price
            }
            months.findOneAndUpdate({year: 2021}, {jan: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Feb
    service.find({ 
        date : {
        '$gte': 'February 1, 2021',
        '$lte': 'February 29, 2021'
        } 
        }, function(err, feb){
            var month = 0
            for(var i = 0; i < feb.length; i++){
                month += feb[i].price
            }
            months.findOneAndUpdate({year: 2021}, {feb: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Mar
    service.find({ 
        date : {
        '$gte': 'March 1, 2021',
        '$lte': 'March 31, 2021'
        } 
        }, function(err, mar){
            var month = 0
            for(var i = 0; i < mar.length; i++){
                month += mar[i].price
            }
            months.findOneAndUpdate({year: 2021}, {mar: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Apr
    service.find({ 
        date : {
        '$gte': 'April 1, 2021',
        '$lte': 'April 30, 2021'
        } 
        }, function(err, apr){
            var month = 0
            for(var i = 0; i < apr.length; i++){
                month += apr[i].price
            }
            months.findOneAndUpdate({year: 2021}, {apr: month}, (err, data)=>{
                console.log(data)
            })
    })
    //May
    service.find({ 
        date : {
        '$gte': 'May 1, 2021',
        '$lte': 'May 31, 2021'
        } 
        }, function(err, may){
            var month = 0
            for(var i = 0; i < may.length; i++){
                month += may[i].price
            }
            months.findOneAndUpdate({year: 2021}, {may: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Jun
    service.find({ 
        date : {
        '$gte': 'June 1, 2021',
        '$lte': 'June 30, 2021'
        } 
        }, function(err, jun){
            var month = 0
            for(var i = 0; i < jun.length; i++){
                month += jun[i].price
            }
            months.findOneAndUpdate({year: 2021}, {jun: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Jul
    service.find({ 
        date : {
        '$gte': 'July 1, 2021',
        '$lte': 'July 31, 2021'
        } 
        }, function(err, jul){
            var month = 0
            for(var i = 0; i < jul.length; i++){
                month += jul[i].price
            }
            months.findOneAndUpdate({year: 2021}, {jul: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Aug
    service.find({ 
        date : {
        '$gte': 'August 1, 2021',
        '$lte': 'August 31, 2021'
        } 
        }, function(err, aug){
            var month = 0
            for(var i = 0; i < aug.length; i++){
                month += aug[i].price
            }
            months.findOneAndUpdate({year: 2021}, {aug: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Sep
    service.find({ 
        date : {
        '$gte': 'September 1, 2021',
        '$lte': 'September 30, 2021'
        } 
        }, function(err, sep){
            var month = 0
            for(var i = 0; i < sep.length; i++){
                month += sep[i].price
            }
            months.findOneAndUpdate({year: 2021}, {sep: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Oct
    service.find({ 
        date : {
        '$gte': 'October 1, 2021',
        '$lte': 'October 31, 2021'
        } 
        }, function(err, oct){
            var month = 0
            for(var i = 0; i < oct.length; i++){
                month += oct[i].price
            }
            months.findOneAndUpdate({year: 2021}, {oct: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Nov
    service.find({ 
        date : {
        '$gte': 'November 1, 2021',
        '$lte': 'November 30, 2021'
        } 
        }, function(err, nov){
            var month = 0
            for(var i = 0; i < nov.length; i++){
                month += nov[i].price
            }
            months.findOneAndUpdate({year: 2021}, {nov: month}, (err, data)=>{
                console.log(data)
            })
    })
    //Dec
    service.find({ 
        date : {
        '$gte': 'December 1, 2021',
        '$lte': 'December 31, 2021'
        } 
        }, function(err, dec){
            var month = 0
            for(var i = 0; i < dec.length; i++){
                month += dec[i].price
            }
            months.findOneAndUpdate({year: 2021}, {dec: month}, (err, data)=>{
                console.log(data)
            })
    })
}

function addYear(){
    months.create({year: 2021}, (err, data)=>{
        console.log(data)
    })
}

exports.updateMonth = updateMonth
exports.addYear = addYear