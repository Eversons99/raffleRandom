/*Importando meu schema (dbUser) para poder inserir meu dados no banco
  Importando bcryptjs para criptografar a senha da meu user 
  Importando jwt para utilizar em algumas verificações / construuções do meu token
  Importando o método/arquivo (auth) onde contem o meu token unico 
*/
const dbUser = require('../database/model/user') 
const bcryptjs = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const auth = require('../config/auth')

async function autheticateSession({email, password}){
    //Verifico se os dados foram recebidos com sucesso
    if(!email) throw new Error(`Email não informado`)
    if(!password) throw new Error(`Senha não informada`)

    //consultando no banco de ja exite um email, se existir ele retorna o objeto onde esse email esta
    const isUser = await dbUser.findOne({email: email}).select('+password')
    if(!isUser) throw new Error(`Não foi encontrado nenhum usuário com este e-mail`)


    //comparando a password informada com a retornada do banco    
    const isValid = await bcryptjs.compare(password, isUser.password)
    if(!isValid) throw new Error(`Senha incorreta`)

    //Gerando o token final para o meu user
    const token =  jwt.sign({}, auth.secret, {subject: JSON.stringify({id: isUser.id, name: isUser.name }), expiresIn: auth.expiresIn})

    console.log(token)
    return token
}


module.exports = autheticateSession