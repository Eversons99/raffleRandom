//Meu "roteador", onde são criadas as rotas

const express = require('express')
const userRouter = express.Router() 
const insertUser = require('../services/createUserService')

//Criando uma rota
userRouter.get('/', function (req, res){
    res.send('Alo Alo Estou aqui')
})

//para pegar os dados no corpo de uma requisição eu uso os comandos abaixo
/*  const body = req.body
    console.log(body)
*/ 
userRouter.post('/', async function(req, res){
    const body = req.body
    console.log(body)

    try{
        await insertUser(body)
        res.json({status: "OK, recived with sucess"})
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }

    
})

module.exports = userRouter