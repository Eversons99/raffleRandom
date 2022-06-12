const dbUser = require('../database/model/user') 


async function createUser(body){
    if(!body.nome || !body.email || !body.tel || !body.numbers) throw new Error ("Algum dados está faltando")
    const createUser = await dbUser.create(body) // insere o user no meu banco

    return createUser
}


module.exports = createUser


//Criar um novo schema,com os numeros, contendo 