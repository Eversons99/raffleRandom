//Este arquivo é o meu router (Principal) contendo todos meus outros roteadores/rotas (user e etc).

// Dependo da rota que o meu usuario acessar eu vou encaminha-lo para o roteador responsavel por esta rota

const express = require('express')
const customerRouter = require('./customer.routes')
const insertNumbers = require('./buyer.numbers.routes')
const userRouter = require('./user.routes')
const sessionRoutes = require('./session.routes')
const loginRouter =  require('./login.routes')
const confirmNumberRouter = require('./consult.number.routes')
const testeRouter = require('./teste.routes')

const routes = express.Router()

routes.use('/customer', customerRouter)
routes.use('/insert_numbers', insertNumbers)
routes.use('/user', userRouter)
routes.use('/session', sessionRoutes)
routes.use('/login', loginRouter)
routes.use('/consult-numbers', confirmNumberRouter)
routes.use('/teste', testeRouter)

module.exports = routes