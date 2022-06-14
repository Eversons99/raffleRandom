//login, logout e troca de senha

const express = require('express')
const sessionRoutes = express.Router()
const autheticateSession = require('../services/authenticateSessionService')
const confirmToken = require('../middlewares/confirmToken')

sessionRoutes.post('/', async function(req, res){
    const { email, password } = req.body
    
    try{
        const token = await autheticateSession({ email, password })
        res.json(token)
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }
})

//Essa é uma rota middleware

sessionRoutes.get('/', confirmToken, async (req, res) => {
    console.log(req.userInfo)
    return res.json(req.userInfo)
})

module.exports = sessionRoutes