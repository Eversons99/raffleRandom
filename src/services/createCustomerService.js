//Importado meu schema
const dbCustomer = require('../database/model/customer') 

//Function que cria meu usario e o insere no BD
async function createUser(body){
    console.log(body)
    if(!body.name || !body.email || !body.phone || !body.cpf || !body.numbers_select) throw new Error ("Algum dado está faltando")
    const createUser = await dbCustomer.create(body) // insere o user no meu banco

    return createUser
}


module.exports = createUser


//Criar um novo schema,com os numeros, contendo 