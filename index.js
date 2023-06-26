const express = require("express");
const cors = require("cors"); 
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const {DB_HOST, PORT} = process.env;
const authRoute = require('./routes/auth');
const { HttpError } = require("./hellpers/HttpError");

const app = express();

//Modellware
app.use(cors());
app.use(express.json());

//Routes 
app.use('/api/auth', authRoute);

mongoose.connect(DB_HOST).then((res) => {
    console.log(`Server work on ${PORT} port`);
    app.listen(PORT)
}).catch(err => {
    console.log(err.message);
    process.exit(1)
})

app.use((__, res) => {
res.status(404).json({
    message: 'Not found'
})
})

app.use((err, req, res, next) => {
    const  {status = 500, message = "Server error"} = err
    res.status(status).json({message})
})