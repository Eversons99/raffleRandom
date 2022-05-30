// Verificar o tamanho da telas -- ok

// Criar os elemento de acordo com o tamanho da tela --ok

// Marcas vendidos e disponiveis -- ok

// Adicionar um ouvidor de eventos para alterar o layout da pagina dinamicamentes

// Verificando o tamanho da tela e definindo o número de colunas e linhas -- ok

const allClients = []
const control = []

function onloadPage (){
    
    const height = window.innerHeight
    const width = window.innerWidth
    let qtdRepeat = 0 
    let qtdPerLine = 0
    
    console.log(`altura: ${height} largura: ${width}`)

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
    console.log(getColor)
    
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
            document.querySelector('.btnFinaly').style.display = 'inline'
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

const btnNextP = document.getElementById('btnNextP')

btnNextP.addEventListener('click', confirmCadast)

function confirmCadast(){

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').textContent
    const email = document.getElementById('email').innerText

    if(name.length == 0  || phone.length == 0 || email.length == 0) alert ('Preencha todos os dados')

    //Salvar o cadastro e confimar o pagamento
}
/*
function Cliente(nome, cpf, email, saldo){
    this.nome = nome 
    this.cpf = cpf  
    this.email = email
    this.saldo = saldo
    this.depositar = function (valor){
        this.saldo += valor
    }
}
*/