//Meu "roteador", onde são criadas as rotas

const express = require('express')
const userRouter = express.Router() 
const insertNumbers = require('../services/createListService')

//Criando a rota principal
userRouter.get('/', function (req, res){
    res.send('Alo Alo Estou aqui')
})

/*Tudo que eu receber na minha rota principal com o method POST eu vou salvar em uma variavel (body)Com os dados salvos na variavel eu vou usar um tryCatch para inserir dados no banco, sempre usase o await e o try catch nesses casos onde as operações podem demorar
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