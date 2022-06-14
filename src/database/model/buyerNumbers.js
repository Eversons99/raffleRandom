//Este arquivo cria um Schema para os dados (numeros) que serão inseridos no banco
const { v4 } = require("uuid")// importando uma biblioteca que  gera um ID unico, aleatoriamente
const connection = require('../conection') // importando meu arquivo de coneção com BD

const numbersSchema = connection.Schema({
    id:{
        type:String,
        unique: true,
        default: v4()
    },

    cpf:{
        type:String,
        required:true,
        validate: /^\d{3}\d{3}\d{3}\d{2}$/
    },

    numbers:{
        type:[Number], //indica que isso é um array de numeros
        required: true
    },

    create_date:{
        type: Date,
        default: Date.now()
    }
})


const numberSelected = connection.model("numberSelected", numbersSchema)

module.exports = numberSelected

