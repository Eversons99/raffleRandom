const express = require('express')
const app = express()
const port = 3001

app.listen(port, () => {
    console.log('Server Running')
})

//Criando rotas
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/mainIndex.js', function(req, res){
    res.sendFile(__dirname + '/mainIndex.js')
})

app.get('/resources/style.css', function(req, res){
    res.sendFile(__dirname + '/resources/style.css')
})

app.use(express.static('images'));

