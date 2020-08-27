const express = require('express');
const router = express.Router();
const Task = require('../model/suscripciones');




router.get('/suscripciones',(req,res)=>{

    res.render("suscripciones")
  
  }) 

module.exports = router;

