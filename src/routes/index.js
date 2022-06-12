// Criei um novo roteador contendo todos meus outros roteadores.
// Dependo da rota que o meu usuario acessar eu vou encaminha-lo para o roteador responsavel por esta rota

const express = require('express')
const userRouter = require('./user.routes')

const routes = express.Router()

routes.use('/user', userRouter)

module.exports = routes