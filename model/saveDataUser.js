// Esse arquvivo monta o schema dos dados a serem salvos

const connection = require('../config/conection') // importando meu arquivo de coneção com BD


const dataSchema = connection.Schema({
    nome:{type:String},
    email:{type:String},
    tel:{type:Number},
})

module.exports = connection.model("DataUser", dataSchema)