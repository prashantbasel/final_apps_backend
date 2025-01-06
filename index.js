// importing the packages (express)
const express = require('express');
const mongoose = require('mongoose');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv')
const cors = require('cors')
const acceptFormData = require('express-fileupload')

//Creating an express app 
const app = express();

// configure cors policy 
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

// dotenv configuration
dotenv.config()

// express
app.use(express.json())

// config form data
app.use(acceptFormData())

//Connecting to database
connectDatabase()

// Defining the port  5000 to 6000
const PORT = process.env.PORT;

// Making a test endpoint
// Endpoints : POST, GET, PUT, DELETE
app.get('/test', (req, res) => {
    res.send("Test API is working")
})

//http://localhost:5000/test

// configuring ROutes of user 
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/booking', require('./routes/bookingRoutes'))
app.use('/api/contact', require('./routes/contactRoutes'))


// http://localhost:5000/api/user/create

// Starting the server 
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT} `)
})

module.exports = app;


