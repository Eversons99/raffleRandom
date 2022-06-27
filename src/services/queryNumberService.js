// mostra para o ADM os status dos numeros
const numberSelected = require('../database/model/buyerNumbers')

async function consultTeste () {
    const consulta = await numberSelected.find({}) // insere o user no meu banco
    

    return consulta

}

module.exports = consultTeste