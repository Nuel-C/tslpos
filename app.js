const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const passportLocal = require('passport-local').strategy
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const bodyParser = require('body-parser')
const Admin = require('./models/admin')
const moment = require('moment')
const service = require('./models/service')
const months = require('./models/months')
const expense = require('./models/expense')
const path = require('path')
const { O_CREAT } = require('constants')
const init = require('./module/monthData')

//Connect to DB
mongoose.connect('mongodb+srv://Nuel:chuks@cluster0.ldv66.mongodb.net/tslpos?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
// mongoose.connect('mongodb://localhost/tsl', {useNewUrlParser: true, useUnifiedTopology: true})


//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser('secret'))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)
app.use(express.static(path.join(__dirname, 'build')))


// init.addYear()

//Routes
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
})



app.post('/signup', (req, res)=>{
    Admin.findOne({username: req.body.username}, async (err, admin)=>{
        if(err) throw err
        if(admin){
            var c = {success:false, admin: ' '}
            res.send(c)
        } 
        if(!admin){
            const hash = await bcrypt.hash(req.body.password, 10)
            const newAdmin = new Admin({
                username: req.body.username,
                password: hash,
                type: req.body.type
            })
            await newAdmin.save()
            var c = {admin:req.body.type, success: true}
            res.send(c)
            console.log(res)
        }
    })
})

app.post('/searchcustomer', (req, res)=>{
    service.find({customer: req.body.search}, (err, customer)=>{
        if(err){
            var c = {success:false, customer}
            res.send(c)
        }else if(customer.length === 0){
            var c = {success:false, customer}
            res.send(c)
            console.log(c.success)
        }else if(customer){
            var c = {success:true, customer}
            res.send(c)
        }else{
            var c = {success:false, customer}
            res.send(c)
        }
    })
})

app.post('/search', function(req, res){//customer or employee search
    if(req.body.number === '' && req.body.sdate === '' && req.body.department === ''){
        service.find({ $or:[ {customer: req.body.search}, {employee: req.body.search} ]}, function(err, customers){
            if(err){
                var c = {success: false, customers}
                console.log(err)
                res.send(c)
            }else if(customers.length === 0){
                var c = {success:false, customers}
                res.send(c)
                console.log(c.success)
            }else{
                var c = {success: true, customers}
                console.log(customers)
                res.send(c)
            }
        })//number search
    }else if(req.body.search === '' && req.body.sdate === '' && req.body.department === ''){
        service.find({phone: req.body.number}, (err, customers)=>{
            if(err){
                var c = {success: false, customers}
                console.log(err)
                res.send(c)
            }else if(customers.length === 0){
                var c = {success:false, customers}
                res.send(c)
                console.log(c.success)
            }else{
                var c = {success: true, customers}
                console.log(customers)
                res.send(c)
            }
        })//date search
    }else if(req.body.search === '' && req.body.number === '' && req.body.department === ''){
        service.find({date: moment(req.body.sdate).format('LL')}, (err, customers)=>{
            if(err){
                var c = {success: false, customers}
                console.log(err)
                res.send(c)
            }else if(customers.length === 0){
                var c = {success:false, customers}
                res.send(c)
                console.log(c.success)
            }else{
                var c = {success: true, customers}
                console.log(customers)
                res.send(c)
            }
        })//department search
    }else if(req.body.search === '' && req.body.number === '' && req.body.sdate === ''){
        service.find({department: req.body.department}, (err, customers)=>{
            if(err){
                var c = {success: false, customers}
                console.log(err)
                res.send(c)
            }else if(customers.length === 0){
                var c = {success:false, customers}
                res.send(c)
                console.log(c.success)
            }else{
                var c = {success: true, customers}
                console.log(customers)
                res.send(c)
            }
        })
    }
    
})

app.get('/getchartdata', (req, res)=>{
    init.updateMonth()
    months.findOne({year: 2021}, (err, data)=>{
        res.json(data)
    })
})

app.post('/range', function(req, res){
    service.find({ 
        date : {
        '$gte': moment(req.body.sdate1).format('LL'),
        '$lte': moment(req.body.sdate).format('LL')
    } 
}, function(err, customers){
        if(err){
            var c = {success: false, customers}
            console.log(err)
            res.send(c)
        }else if(customers.length === 0){
            var c = {success:false, customers}
            res.send(c)
            console.log(c.success)
        }else{
            var c = {success: true, customers}
            console.log(customers)
            res.send(c)
        }
    })
})


app.get('/receipts', function(req, res){
    service.find({}, function(err, services){
        if(err){
            console.log(err)
            res.send(err)
        }else{
            res.send(services)
        }
    })
})

app.get('/expensereceipts', function(req, res){
    expense.find({}, function(err, expenses){
        if(err){
            console.log(err)
            res.send(err)
        }else{
            res.send(expenses)
        }
    })
})

app.post('/add', (req, res)=>{
    if(req.body.service === '30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 6000 - (6000 * (newDiscount/100))
        var newAprice = 6000
        var newCopies = 7
        var newService = {
            session: '30 Mins. session',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === '1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 12000 - (12000 * (newDiscount/100))
        var newCopies = 14
        var newAprice = 12000
        var newService = {
            session: '1 Hour session',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'children 30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 8000 - (8000 * (newDiscount/100))
        var newCopies = 8
        var newAprice = 8000
        var newService = {
            session: 'Children shoot from 6months - 5years, 30Mins.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'children 1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 16000 - (16000 * (newDiscount/100))
        var newAprice = 16000
        var newCopies = 14
        var newService = {
            session: 'Children shoot from 6months - 5years, 1Hour',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'group 30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 8000 - (8000 * (newDiscount/100))
        var newCopies = 6
        var newAprice = 8000
        var newService = {
            session: 'Group photo with family or friends, 30Mins.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'group 1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 15000 - (15000 * (newDiscount/100))
        var newCopies = 12
        var newAprice = 15000
        var newService = {
            session: 'Group photo with family or friends, 1Hour',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'product 30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 10000 - (10000 * (newDiscount/100))
        var newCopies = 8
        var newAprice = 10000
        var newService = {
            session: 'Product shoot, 30Mins.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'product 1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 20000 - (20000 * (newDiscount/100))
        var newAprice = 20000
        var newCopies = 15
        var newService = {
            session: 'Product shoot, 1Hour.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'home 30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 15000 - (15000 * (newDiscount/100))
        var newCopies = 7
        var newAprice = 15000
        var newService = {
            session: 'Photo session (Home service), 30Mins.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'home 1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 30000 - (30000 * (newDiscount/100))
        var newCopies = 14
        var newAprice = 30000
        var newService = {
            session: 'Photo session (Home service), 1Hour',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'outdoor 1hour'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 40000 - (40000 * (newDiscount/100))
        var newCopies = 20
        var newAprice = 4000
        var newService = {
            session: 'Photo session (Outdoor), 1Hour',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'outdoor 30mins'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 20000 - (20000 * (newDiscount/100))
        var newCopies = 10
        var newAprice = 20000
        var newService = {
            session: 'Photo session (Outdoor), 30Mins.',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }else if(req.body.service === 'artist'){
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = 3000 - (3000 * (newDiscount/100))
        var newCopies = null
        var newAprice = 3000
        var newService = {
            session: 'Artist photoshoot @ the studio, 1Hour',
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
    }





})

app.post('/addexpense', (req, res)=>{
    var details = {
        description: req.body.description,
        recipient: req.body.recipient,
        amount: req.body.amount,
        date: moment(Date.now()).format('LL'),
        employee: req.body.employee,
        receiptnumber: '000'+Math.floor(Math.random() * 100001),
        department: req.body.department
    }
    expense.create(details, (err, expense)=>{
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(expense)
            res.send(expense)
        }
        expense.save()
    })
})

app.post('/custom', (req, res)=>{
        var newCustomer = req.body.customer
        var newDiscount = req.body.discount
        if(req.body.discount === ''){
            newDiscount = 0
        }
        var newPrice = req.body.price - (req.body.price * (newDiscount/100))
        var newCopies = req.body.copies
        var newAprice = req.body.price
        var newService = {
            session: req.body.service,
            customer: newCustomer,
            discount: newDiscount,
            price: newPrice,
            copies: newCopies,
            aprice: newAprice,
            employee: req.body.employee,
            phone: req.body.phone,
            date: moment(Date.now()).format('LL'),
            department: req.body.department,
            receipt: '000'+Math.floor(Math.random() * 100001),
            month: Intl.DateTimeFormat('en-US', {month:'long'}).format()
    }
    service.create(newService, function(err, services){
        if(err){
            console.log(err)
            res.send(false)
        }else{
            console.log(services)
            res.send(services)
        }
        services.save()
    })
})

app.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, admin, info)=>{
        if(err){
            res.send(false)
        };
        if(!admin) {
            res.send(false)
        }else{
            req.login(admin, err => {
                if(err) throw err
                res.send(admin.type)
                console.log(admin.type)
            })
        }
    })(req, res, next)
})

app.get('/logout', (req, res)=>{
    req.logout()
    res.send(true)
})

app.get('*', (req, res)=>{
    ers.redirect('/')
})


//Start server
app.listen(process.env.PORT || 5000, ()=>{
    console.log('Api Running')
})