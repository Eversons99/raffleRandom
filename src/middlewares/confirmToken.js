//Esse é o middleware que intercepta e valida o meu token


const jwt = require('jsonwebtoken')
const express = require('express')
const auth = require('../config/auth')

async function confirmToken (req, res, next){
    const authorizationToken = req.headers.authorization

    if(!authorizationToken) return res.status(400).send('Token não informado')

    const [,token] = authorizationToken.split(" ")

    if(!token)  return res.status(401).send('Token invalido')

    try {
        //Salvando alguns dados do ususario para caso eu precise porteriormente
        const decoded = jwt.verify(token, auth.secret)
        const { id, name } = JSON.parse(decoded.sub)

        req.userInfo = {
            id,
            name
        }

        next()
    } catch (error) {
        return res.status(401).send('Token invalido')
    }
}


module.exports = confirmToken