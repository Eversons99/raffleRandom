//Esse arquivo é responsavel por fazer a conexão com o banco de dados
const mongoose = require('mongoose')
const uri = "mongodb://localhost:27017/myBd" //Local onde o mongo esta instalado

mongoose.connect(uri) //Conectando-me ao BANCO

module.exports = mongoose