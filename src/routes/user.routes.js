const express = require('express')
const userRouter = express.Router()
const createUser = require('../services/createUserService')

userRouter.post('/', async function(req, res){
    const body = req.body
    console.log(body)

    try{
        let user = await createUser({userData: body})
        res.json(user)
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }
})

module.exports = userRouter

/*
userRouter.get('/:nome', (req, res) => {
    const nome = req.params.nome
    res.send(nome)
})

userRouter.get('/', (req, res) => {
    const {nome} = req.query
    res.send(nome)
})

module.exports = userRouter
*/