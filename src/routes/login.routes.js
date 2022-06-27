const express = require('express')
const loginRouter = express.Router()
const loginUser = require('../services/loginUserSerivice')

loginRouter.post('/', async function(req, res){
    const body = req.body

    try{
        let user = await loginUser({userData: body})
        res.json(user)
     
        
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }


})

module.exports = loginRouter
