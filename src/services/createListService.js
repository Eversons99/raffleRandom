//Importado meu schema para inserção dos numeros comprados
const numberSelected = require('../database/model/buyerNumbers')

//Function que cria meu usario e o insere no BD
async function insertNumber(numbersOfClient){
    console.log(numbersOfClient)
    if(!numbersOfClient.cpf ||!numbersOfClient.numbers) throw new Error ("Algum dado está faltando")

    const insertNumber = await numberSelected.create(numbersOfClient) // insere o user no meu banco

    return insertNumber
}


module.exports = insertNumber

