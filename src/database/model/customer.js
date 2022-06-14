 

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
        //unique: true
    },

    cpf:{
        type:String,
        required:true,
        validate: /^\d{3}\d{3}\d{3}\d{2}$/
    },

    numbers_select:{
        type:[Number], //indica que isso é um array de numeros
        required: true,
        unique: true
    },

    create_date:{
        type: Date,
        default: Date.now()
    }
})

const dbCustomer = connection.model("dbCustomer", dataSchema)

module.exports = dbCustomer

