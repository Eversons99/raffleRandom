const control = []


class Client {
    constructor(name, phone, email, cpf, numbers_select) {  // Constructor
      this.name = name;
      this.phone = phone;
      this.email = email
      this.cpf = cpf
      this.numbers_select = numbers_select
    }
}

function onloadPage (){
    
    const height = window.innerHeight
    const width = window.innerWidth
    let qtdRepeat = 0 
    let qtdPerLine = 0

    if(width <= 450){
        qtdRepeat = 200
        qtdPerLine = 5
        createDataTable(qtdRepeat, qtdPerLine)
    }

    else if(width > 450 && width <= 650){
        qtdRepeat = 100
        qtdPerLine = 10
        createDataTable(qtdRepeat, qtdPerLine)
    }

    else if(width > 650 ){
        qtdRepeat = 50
        qtdPerLine = 20
        createDataTable(qtdRepeat, qtdPerLine)
    }
}
 
// Cria a tabela
function createDataTable(qtdRepeat, qtdPerLine){

    const tbody = document.querySelector('tbody')
    let count = 1

    for(let i = 0; i < qtdRepeat; i++){
            
        const row = document.createElement('tr')
            
        for(let j = 0; j < qtdPerLine; j++) {
            const collumn = document.createElement('td')
            collumn.textContent = count++
            collumn.setAttribute('id', `row${collumn.textContent}`)
            collumn.setAttribute('class', 'numbers')
            collumn.setAttribute('onclick', `confirmDisp(${collumn.textContent})`)
            row.appendChild(collumn)
        }

        tbody.appendChild(row)
    } 
}

/*Daqui para baixo precisa ser modificado*/

//Confirma as cores e marca se está disponivel ou indisponivel
function confirmDisp(idCell){
    const getNum = document.getElementById(`row${idCell}`)
    const getColor = window.getComputedStyle(getNum).backgroundColor

    if(getColor == "rgb(58, 85, 94)") alert(`${idCell} está indisponivel`)
    //if(getColor == "rgb(144, 238, 144)") alert(`${idCell} está disponivel`)
    if(getColor == "rgb(231, 239, 241)") addNumberInCar(getNum)
}

function addNumberInCar(getNum){
    const currentNum = getNum.textContent
    
    const confirmFirstbuy = confirm('Deseja comprar esse numero ?')

    if(confirmFirstbuy == true){
        //Adiciono o numero escolhido na aray de controle
        
        // Pego a div resultado para inseir os numero selecionados e salvar os valores
        const divResult = document.querySelector('.numbers-selected')
        const currentResult = divResult.textContent 
        
        if(divResult.childNodes.length == 1) {
            control.push(currentNum)
            document.querySelector('.btn-finaly').style.display = 'inline'
            divResult.append(`Número(s) selecionado(s): \n ${currentNum}`)
            
        }
        else{
            const verifDupicate = `${currentResult}`
            const queryDuplicate = verifDupicate.indexOf(currentNum)
            if(queryDuplicate != -1){
                alert('Este número já foi incluido em sua lista')
            }
            else {
                control.push(currentNum)
                divResult.append(`, ${currentNum}`)
            }
        } 
    }   
}

/*Agora basta coletar os dados dos usuarios, os numeros selecionados e confirmar o pagamento  */

//Esconde a div container e apresenta o form, alem disso printa os nmr comprados
function finalyBuy(){
    document.querySelector('.container').style.display = 'none'
    document.querySelector('.form').style.display = 'flex'
     
    const divResult = document.getElementById('resultList')
    divResult.append(`${control}`)

}

const btnNextP = document.getElementById('btn-next-prosseg')
btnNextP.addEventListener('click', confirmCadast)

function confirmCadast(){

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const email = document.getElementById('email').value
    const cpf = document.getElementById('cpf').value
    const numbers_select = []
    
    const regexCpf = /^\d{3}\d{3}\d{3}\d{2}$/
    const regexPhone = /^\d{2} 9?\d{8}$/

    if(!name || !phone || !email || !cpf) return alert ('Preencha todos os dados')
    if(regexPhone.test(phone) == false) return alert (`Insira o telefone como no exemplo: \n (DD) XXXXXXXXX `)
    if(regexCpf.test(cpf) == false) return alert (`Insira apenas os números do seu CPF, como no exemplo: \n XXXXXXXXXXX `)
    
    for(number of control){
        numbers_select.push(number)
    }

    //Limpando a lista
    while(control.length > 0){
        control.pop()
    }

    //Salvar o cadastro e confimar o pagamento
    insertClient(name, phone, email, cpf, numbers_select)
}

async function insertClient(name, phone, email, cpf, numbers_select){
    const newClient = new Client(name, phone, email, cpf, numbers_select)
    const numbersOfClient = {
        numbers: numbers_select,
        cpf: cpf
    }
    // Cria opções da requisição
    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            newClient
        )
    }
    
    // Envia dados para o backgroud
    let dataUser = await fetch('user', opt)
        
    // Recebe a resposta do background
    dataUser = await dataUser.json()

    console.log(dataUser)

    // Cria opções da requisição
 
    const newOpt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            numbersOfClient
            )
    }
    
    // Envia dados para o backgroud
    let dataNumbers = await fetch('insert_numbers', newOpt)
        
    // Recebe a resposta do background
    dataNumbers = await dataNumbers.json()

    console.log(dataNumbers)

    if(dataUser.status != "OK, recived with sucess" || dataNumbers.status != "OK, recived with sucess") return alert ("Algum dado está faltando ou foi inserido incorretamente")

    document.querySelector('.form').style.display = "none"
    document.querySelector('.completed-buy').style.display = "flex"
}


//Agora com os dados salvos bastar inseri-los em um BD e gerar o pix

/*1º Gerar o PIX 
  2º Enviar os dados coletados para o banco de dados
  3º Marcar o numero como em espera ou vendido
  4º Atualizar os numero vendidos sempre que carregarem a pagina 
*/  
  
