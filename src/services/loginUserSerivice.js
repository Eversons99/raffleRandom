//Importado meu schema
const dbUser = require('../database/model/user') 

// Um array como todos os campos que são obrigatórios, esse array será usado para fazer uma comparação abaixo
const requiredFields = ["email", "password"]

//Function que valida o longin e redireciona o usuario para a sua workarea
async function confirmLogin({ userData }){

    let userFields = Object.keys(userData);

    requiredFields.forEach(field => {
        if (userFields.indexOf(field) == -1 || !userData[field] )
            throw new Error(`Parâmetro ${field} não encontrado.`)
    })

    //Consultando o meu BD para verificar se existe algum email igual ao que foi passado nos parametros
    const isUserEmail = await dbUser.find({ email: userData.email })
    const isUserPassword = await dbUser.find({ password: userData.password })
    
    if(isUserEmail.length == 0) throw new Error ("Email incorreto") 
    if(isUserPassword.length == 0) throw new Error ("Senha incorreta")
 

    //hash seria senha do meu usuario, hashSync recebe dois parametros, a senha que ele inseriu e a rodade de criptografias (10)
    //const hash = bcryptjs.hashSync(userData.password, 10)

    //userData.password = hash


    return  "Login efetuado com sucesso"
}


module.exports = confirmLogin