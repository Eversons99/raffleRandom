//Importado meu schema
const dbUser = require('../database/model/user') 
const bcryptjs = require('bcryptjs') // Usado para criptografar a senha


// Um array como todos os campos que são obrigatórios, esse array será usado para fazer uma comparação abaixo
const requiredFields = ["name", "email", "phone", "cpf", "password"];

//Function que cria meu usario e o insere no BD
async function createUser({ userData }){
    console.log(userData)

    /*
        uso o Object.Keys para pegar as chaves do meu  objeto json, no caso userData (objeto que foi recebido)

        Após isso faço um forEach verificando pelo meu array de campos obrigatorios (requiredFields) verificando se encontro o campo, e também confirmo se ele não esta vazio (!userData[field])

        Caso não encontre o campo ou ele não tenha valor eu retorno um erro
    */ 
    let userFields = Object.keys(userData);
    requiredFields.forEach(field => {
        if (userFields.indexOf(field) == -1 || !userData[field] )
            throw new Error(`Parâmetro ${field} não encontrado.`)
    })

    //Consultando o meu BD para verificar se existe algum email igual ao que foi passado nos parametros
    const isUser = await dbUser.find({email: userData.email})
    
    console.log(isUser)
    
    if(isUser.length > 0) throw new Error(`O e-mail já está cadastrado.`)
    if(userData.password.length < 8) throw new Error(`A senha precisa ter no mínimo 8 digitos.`)

    //hash seria senha do meu usuario, hashSync recebe dois parametros, a senha que ele inseriu e a rodade de criptografias (10)
    const hash = bcryptjs.hashSync(userData.password, 10)

    userData.password = hash


    const createUser = await dbUser.create(userData) // insere o user no meu banco

    return createUser
}


module.exports = createUser


//Criar um novo schema,com os numeros, contendo 