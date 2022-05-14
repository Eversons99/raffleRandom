
// Verificar o tamanho da telas -- ok

// Criar os elemento de acordo com o tamanho da tela --ok

// Marcas vendidos e disponiveis 

// Adicionar um ouvidor de eventos para alterar o layout da pagina dinamicamentes


// Verificando o tamanho da tela e definindo o número de colunas e linhas
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
            collumn.setAttribute('onclick', `confirmDisp(${collumn.textContent})`)
            row.appendChild(collumn)
        }

        tbody.appendChild(row)
    } 

}

function confirmDisp(idCell){
    const getDisp = document.getElementById(`row${idCell}`)
    const getColor = window.getComputedStyle(getDisp).backgroundColor
    if(getColor == "rgb(255, 158, 158)") alert(`${idCell} está indisponivel`)
    if(getColor == "rgb(144, 238, 144)") alert(`${idCell} está disponivel`)
    
}

