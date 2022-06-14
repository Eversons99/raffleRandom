//Neste arquivo eu possuo um "roteador", onde são criadas as rotas e onde os dados são tratados

const express = require('express')
const userRouter = express.Router() 
const insertNumbers = require('../services/createListService')

//Criando a rota principal
userRouter.get('/', function (req, res){
    res.send('Request recived with sucess')
})

/*Tudo que eu receber na minha rota principal com o method POST eu vou salvar em uma variavel (body)Com os dados salvos na variavel eu vou usar um tryCatch para inserir dados no banco, sempre usa-se o await e o try catch nesses casos onde as operações podem demorar
*/
userRouter.post('/', async function(req, res){
    const dataNumbers = req.body
    console.log(dataNumbers)

    try{
        await insertNumbers(dataNumbers)
        res.json({status: "OK, recived with sucess"})
    }
    catch(error){
        console.log(error.message)
        res.json({status: error.message})
    }
})

module.exports = userRouter