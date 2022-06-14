// Esse arquvivo monta o schema dos dados a serem salvos
// Para é aconselhavel seperar os Schemas em arquivos diferentes
// Na exportação do V4 estou importando uma função (uuid) que gera um ID unico para cada registro inserido
 

const { v4 } = require("uuid")
const connection = require('../conection') // importando meu arquivo de coneção com BD

// required: true == not null 
// unique: true == verificar se já existe algum dado igual no cadastro, caso exista será gerado um erro

const dataSchema = connection.Schema({
    id:{
        type:String,
        unique: true,
        default: v4()
    },

    name:{
        type:String, 
        required: true 
    },

    phone:{
        type:String,
        required: true,
        validate: /^\d{2} 9?\d{8}$/
    },

    email:{
        type:String, 
        required: true, 
        unique: true
    },

    password:{
        type:String,
        required: true,
        select: false      // Quando eu busco o usuario ele não traz a senha
    },

    cpf:{
        type:String,
        required:true,
        validate: /^\d{3}\d{3}\d{3}\d{2}$/
    },

    create_date:{
        type: Date,
        default: Date.now()
    }

})

const dbUser = connection.model("dbUser", dataSchema)

module.exports = dbUser

