const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const  bodyParser = require('body-parser');
const app = express();

app.use('/api/user', authRouter);

// configuration routes
dotenv.config();

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true  },()=>{
    console.log('mongodb connected');
    
})

app.use(bodyParser.json())


app.listen(3000, ()=> console.log('server up and running at port 3000'))
