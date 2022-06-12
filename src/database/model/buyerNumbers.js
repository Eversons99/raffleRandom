const { v4 } = require("uuid")
const connection = require('../conection') // importando meu arquivo de coneção com BD

const numbersSchema = connection.Schema({
    id:{
        type:String,
        unique: true,
        default: v4()
    },

    email:{
        type:String, 
        required: true, 
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

