//Esse arquivo é responsavel por fazer a conexão com o banco de dados
const mongoose = require('mongoose')
const uri = "mongodb://localhost:27017/raffleRandom" //Local onde o mongo esta instalado

mongoose.connect(uri) //Conectando-me ao BANCO
mongoose.Promise = global.Promise 

module.exports = mongoose