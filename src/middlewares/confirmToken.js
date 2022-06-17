//Esse arquivo é o middleware que "intercepta" minha requisição e valida o meu token

/*
Abaixo estou importando o jwt que é utilizado para realizar algumas verificações no meu token
E também estou importando o meu arquivo que contem uma parte do meu token unico gerado por mim
*/ 
const jwt = require('jsonwebtoken')
//const express = require('express')
const auth = require('../config/auth')

//Essa função recebe 3 params como uma rota, req para requisição, res para resposta e next () para indicar a minha função para prosseguir para o proximo passo
async function confirmToken (req, res, next){

    //Salvando o dado authorization que veio no header da minha requisição, este dado tem uma parte que confirma se o token é refenrente a minha aplicação ou não, é como se fosse apenas um token
    //O padrão recebido no authorization seria mais ou menos assim [padrão (Bearer / token) inserido por mim, token do meu user]: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTUxNjgwODEsImV4cCI6MTY1NTI1NDQ4MSwic3ViIjoie1wiaWRcIjpcIjZmNjU0OTQ4LTZlOTMtNDdiYi04YTYyLWYxYzllN2QyYzU2NlwiLFwibmFtZVwiOlwiRXZlcnNvblwifSJ9.7iH8LHjEgiPFu7viEKKcj86pPNP0DTqAV6G5z6H30CI"
    const authorizationToken = req.headers.authorization

    //Validando se o dado (authorization) foi recebido com sucesso, caso não eu retorno um status HTTP e uma mensagem
    if(!authorizationToken) return res.status(400).send('Token não informado')

    //A minha authorizationToken é uma "string" com apenas um espaço, eu preciso dividi-la e pegar apenas a segunda parte da minha string, é exatamente isso que eu estou salavando na const [,token], a ultima posição da minha string splitada
    const [,token] = authorizationToken.split(" ")

    //Validaando se o dado existe
    if(!token)  return res.status(401).send('Token invalido')

    //Caso o programa chegue até este ponto, isso significa qu o usuário possui o token para realizar o acesso em minha aplicação

    try {
        //Usando a biblicoteca jwt e o método verify para confirmar se o meu token recebido é igual ao token unico da minha aplicação que esta no meu arquito auth na chave secret
        const decoded = jwt.verify(token, auth.secret)

        //pegando os dados do meu user e salvando para saber quem realizou o acesso
        //sub, são as informações que eu utilizei para gerar meu token, aqui estou decodificando-as
        const { id, name } = JSON.parse(decoded.sub)

        req.userInfo = {
            id,
            name
        }
        //Falando para minha applicação seguir para o proximo passo
        next()
    } catch (error) {
        //Caso de algum erro eu rotorno um status HTTP e uma mensagem
        return res.status(401).send('Token invalido')
    }
}


module.exports = confirmToken