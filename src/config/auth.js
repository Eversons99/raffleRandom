/*Este arquivo defini a chave unica (aleatoria que eu mesmo criei (secret)) para compor o token de acesso do meu user, além disso ele define o "período de vida" do meu token
*/

const jwt = {
    secret: "093137ed8a501d4e65c37d6aee211d8e",    //chave unica da minha aplicação
    expiresIn: "1d" //tempo que o token vai ser valido, neste caso um dia, pode-se definir minutos, anos e etc 
}


module.exports = jwt