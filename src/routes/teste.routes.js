const express = require('express')
const testeRouter = express.Router()
const consultTeste = require('../services/queryNumberService')

testeRouter.get('/', async function(req, res){

    let user = await consultTeste()
    res.json(user)
       
})

module.exports = testeRouter