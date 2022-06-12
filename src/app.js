const express = require('express')
const app = express()
const port = 3001

app.use(express.static('public'))

//Importo meu roteador com todos meu outros routers e suas respectivas rotas
const routes =  require('./routes/index')

//Isso indica que no corpo da requisição pode conter um JSON
app.use(express.json())

// Digo para a minha app usar este router
app.use(routes)

// Servidor ouvindo na port 3001
app.listen(port, () => {
    console.log('Server Running')
})















//Criando rotas
/*app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})*/
/*
app.get('/mainIndex.js', function(req, res){
    res.sendFile(__dirname + '/mainIndex.js')
})

app.get('/resources/style.css', function(req, res){
    res.sendFile(__dirname + '/resources/style.css')
})

//Deixando as imagens publicas para reinderizar no html;
app.use(express.static('images'));

*/