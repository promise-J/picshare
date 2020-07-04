const express = require('express');
const User = require('../model/User');
const router = express.Router();


router.post('/register',(req,res)=>{
    res.send('it works')
})



module.exports = router;