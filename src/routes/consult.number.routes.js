
const express = require('express')
const confirmNumberRouter = express.Router()
const consultNumbers = require('../services/consultNumbersService')

confirmNumberRouter.get('/', async function(req, res){
    
    try{
        let numbers = await consultNumbers()
        res.json(numbers)
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }
})

module.exports = confirmNumberRouter
