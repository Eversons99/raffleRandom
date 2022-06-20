//Importado meu schema para inserção dos numeros comprados
const numberSelected = require('../database/model/buyerNumbers')

//Function que cria meu usario e o insere no BD
async function confirmNumbers(){
    
    const queryNumbers = await numberSelected.find({}) // insere o user no meu banco
    const allNumbers = []
    
    
    queryNumbers.forEach(number => {
        let currentArrayNumbers = number.numbers
        for(let i in currentArrayNumbers){
            allNumbers.push(currentArrayNumbers[i])
        }
    })

    console.log(allNumbers)
    return allNumbers
}

module.exports = confirmNumbers

