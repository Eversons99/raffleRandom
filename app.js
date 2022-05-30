//Rodando meu server na porta 3000 
const path = require('path');
const express = require ('express')
const app = express()
const port = 3000


app.listen(port, () => {
    console.log('Running Server')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})
/*
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});
*/