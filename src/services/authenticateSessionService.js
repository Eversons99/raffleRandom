const dbUser = require('../database/model/user') 
const bcryptjs = require('bcryptjs') // Usado para criptografar a senha
const jwt = require('jsonwebtoken')
const auth = require('../config/auth')

async function autheticateSession({email, password}){
    if(!email) throw new Error(`Email não informado`)
    if(!password) throw new Error(`Senha não informada`)


    console.log(email)

    //consultando no banco de ja exite um email, se existir ele retorna o objeto
    const isUser = await dbUser.findOne({email: email}).select('+password')
    if(!isUser) throw new Error(`Não foi encontrado nenhum usuário com este e-mail`)


    //comparando a password informada com a retornada do banco    
    const isValid = await bcryptjs.compare(password, isUser.password)
    if(!isValid) throw new Error(`Senha incorreta`)


    const token =  jwt.sign({}, auth.secret, {subject: JSON.stringify({id: isUser.id, name: isUser.name }), expiresIn: auth.expiresIn})

    console.log(token)
    return token
}


module.exports = autheticateSession