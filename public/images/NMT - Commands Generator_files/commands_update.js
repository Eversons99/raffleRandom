let totalOnts
let filterOnts
let allAttenuations = []

function loadingAnimation(active) {
    const loading = document.querySelector('.modal-loader')

    if(active == true){
        loading.style.display =  "flex"
    }

    if(active == false) {
        loading.style.display =  "none"
    }
    
}

// Popula as options dos selects de slot e ports
async function getHosts() {
    const olt = document.getElementById('select-olt-origin')
    const slot = document.getElementById('select-slot-origin')
    const port = document.getElementById('select-port-origin')

    slot.innerHTML = ''
    port.innerHTML = ''

    // Consulta o NMT para pegar o arquivo hosts
    let hosts = await fetch(`/files/hosts/${olt.value}`)
    hosts = await hosts.json()

    if (hosts.length == 0) window.alert('Erro ao se comunicar com o servidor, nenhum host/placa retornado.')

    // Loopa pelo resultado da requisição e cria os options do select de slots
    hosts.forEach((element) => {
        const option = document.createElement('option')
        option.textContent = element.split('/')[1]
        slot.append(option)
    })

    // Loopa pelo resultado da requisição e cria os options do select de portas
    let ports = 0
    while (ports <= 15) {
        const option = document.createElement('option')
        option.textContent = ports
        port.append(option)
        ports++
    }
}

// Consulta NMT para pegar as ONTs disponíveis em determinada porta PON
async function getOnts() {

    // Pega os valores selecionados dos selects de olt, slot e port
    const olt = document.getElementById('select-olt-origin').value
    const slot = document.getElementById('select-slot-origin').value
    const port = document.getElementById('select-port-origin').value

    if (!olt || !slot || !port){
        alert('Preencha F/S/P')
        return false
    } 

    oldGpon = `0/${slot}/${port}`

    // Cria opções da requisição
    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gpon: `0/${slot}/${port}`,
            host: olt,
        }),
    }
    loadingAnimation(true)
    // Consulta NMT para pegar as ONTs dessa porta GPON
    let onts = await fetch('/olt/onts-table', opt)
    onts = await onts.json()

    totalOnts = onts
    
    if(onts.error == 'No onts were found') {
        loadingAnimation(false)
        return alert("Nenhuma ONU foi encontrada nessa localização PON")
    }
    
    
    //Esconde a locatio GPON origin e mostra as locations de destino
    document.querySelector('.origin-location').style.display = "none"
    document.querySelector('.destination-location').style.display = "inline"
    loadingAnimation(false)
    

    // Printa os resultados na tabela
    await printTable(onts)
}

// Printa os resultados da consulta do NMT em uma tabela
async function printTable(onts) {

    // Salva o elemento da tabela em variável
    const table = document.getElementById('table')

    // Loop por cada ONT que o NMT devolveu
    onts.forEach((ont) => {
        // Cria linha e adiciona o atributo id como 'row-id da ONU'
        const row = document.createElement('tr')
        row.setAttribute('id', `row-${ont.id}`)

        // Cria um elemento td para cada dado que será mostrado na tabela
        const index = document.createElement('td')
        const sn = document.createElement('td')
        const status = document.createElement('td')
        const type = document.createElement('td')
        const mikrotikTd = document.createElement('td')
        const selectTd = document.createElement('td')

        // Atribui valores para index, sn e type
        index.textContent = ont.id
        sn.textContent = ont.sn.toUpperCase()
        type.textContent = ont.type

        // Se a ONU estiver offline, adiciona a classe offline para deixar vermelho
        if (ont.status == 1) status.textContent = 'ONLINE'
        if (ont.status == 2) {
            status.textContent = 'OFFLINE'
            status.setAttribute('class', 'offline')
            row.style.color = '#FE2E64'
        }

        // Cria input do tipo checkbox para a coluna mikrotik
        const mikrotik = document.createElement('input')
        mikrotik.setAttribute('type', 'checkbox')
        mikrotikTd.append(mikrotik)

        // Cria input do tipo checkbox para a coluna de seleção e atribui id e evento de onclick
        const select = document.createElement('input')
        select.setAttribute('type', 'checkbox')
        select.setAttribute('id', 'select-item')
        select.setAttribute('onclick', 'isSelected(event)')
        selectTd.append(select)

        // Adiciona todos os elementos td na row e depois adiciona a row na table
        row.append(select, index, sn, type, status, mikrotik)
        table.append(row)

    })
    
    // Deixa todos os registros selecionados
    if(allAttenuations.length == 0){
        const allSelect = document.getElementById('select-all').click()
    }
    
    countOnts()
    
}

// Verifica se o botão de selecionar todas está ativo
function selectAll() {
    // Pega todos os inputs do tipo checkbox com id #select-item
    const checkboxes = document.querySelectorAll('#select-item')

    // Pega input checkbox de selecionar todas e seu valor
    const masterCheckbox = document.getElementById('select-all')
    const isSelected = masterCheckbox.checked

    // Loopa por todos os elementos de selecionar, adicionando o valor atual do input master a eles
    checkboxes.forEach((check) => {
        check.checked = isSelected
        if (isSelected == true) return check.parentElement.setAttribute('class', 'selected')

        return check.parentElement.setAttribute('class', '')
    }) 
}

// Altera a classe dos elementos selecionados
function isSelected(e) {
    // Verifica se elemento está selecionado. Se sim, altera sua classe.
    if (e.target.checked == true) {
        return e.target.parentElement.setAttribute('class', 'selected')
    }

    return e.target.parentElement.setAttribute('class', '')
}

function countOnts() {
    //Criando os elemento para exibi-los com o os valores
    const offlines = document.querySelector('.total-onts-offline')
    const onlines = document.querySelector('.total-onts-online')
    const totalOnts = document.querySelector('.total-onts')

    const total = document.querySelectorAll('tr').length - 1
    const off = document.querySelectorAll('.offline')

    //Alterando o conteúdo dos elementos
    onlines.textContent = `Online: ${total - off.length}`
    offlines.textContent = `Offline: ${off.length}`
    totalOnts.textContent = `Total: ${total}`
}

// Cria o array de ONTs que serão mandadas para o NMT para gerar os comandos
async function generateOntArray() {    
    loadingAnimation(true)
    // Pega todos os elementos input do tipo checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    // Variável de controle
    const onts = []

    // Loop que roda por todos os inputs tipo checkbox
    checkboxes.forEach((check) => {
        // Verifica se o input está marcado ou não. Se sim, pega os valores da coluna da tabela e adiciona no array onts
        if (check.checked == true && check.id != 'select-all') {
            const row = document.getElementById(check.parentElement.id)
            const data = row.childNodes
            onts.push(data[1].textContent)
        }
    })

    // Loop que filtra as ONTs que estão com o checkbox de mikrotik marcados como true e adiciona o atributo "mikrotik: true" na ONT
    filterOnts = totalOnts.filter((item) => onts.indexOf(item.id) >= 0)
    filterOnts.forEach((item) => {
        const checkMikrotik = document.getElementById(`row-${item.id}`)
        if (checkMikrotik.childNodes[5].checked == true) item.mikrotik = true
    })


    const host = document.getElementById('select-olt-destination').value
    const gpon = `0/${document.getElementById('select-slot-destination').value}/${document.getElementById('select-port-destination').value}`
    const name = document.getElementById('file-name').value

    
    await getCommands(gpon, host, name)
    loadingAnimation(false)

}

// Envia as ONTs que deverão ser incluídas nos comandos
async function getCommands(gpon, host, name) {
    // Configura a requisição
    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            onts: filterOnts,
            gpon,
            host,
            name,
            oldGpon,
        }),
    }
    console.log(opt)


    // Requisição para o NMT
    let response = await fetch('/olt/migration-commands', opt)
    response = await response.json()

    if (response.error) return window.alert(response.error)

    // Printa os comandos na tela
    showResults(response)
}

// Cria elementos na tela com os resultados de cada comando
async function showResults(response) {

    let modifyURL
    // Pega a div resultado, salva em variável e mostra ela na tela.
    const result = document.getElementById('result')
    result.style.display = 'flex'

    // Esconde a div destino-container
    const container = document.querySelector('.destination-location')
    container.style.display = 'none'

    // Cria elementos 'object' aonde o texto de cada comando será inserido
    const objectInterface = document.createElement('object')
    const objectGlobal = document.createElement('object')
    const objectDelete = document.createElement('object')

    /*CACHORRADA MASTER BLASTER PARA FUNCIONAR NO MOBILE*/

    // Coloca classe de resultado ativo primeiramente no comando de interface, atribui um id e insere os resultados que o NMT devolveu dentro do object
    objectInterface.setAttribute('class', 'resultado-ativo')
    objectInterface.setAttribute('id', 'resultado-interface')
    objectInterface.setAttribute('data', `http://10.0.30.244:4000/files/${modifyURL = await splitagem(response.interfaceCommands)}`)
    //objectInterface.setAttribute('data', response.interfaceCommands)
   

    // Coloca classe de resultado inativo no comando global, atribui um id e insere os resultados que o NMT devolveu dentro do object
    objectGlobal.setAttribute('class', 'resultado-inativo')
    objectGlobal.setAttribute('id', 'resultado-global')
    objectGlobal.setAttribute('data', `http://10.0.30.244:4000/files/${modifyURL = await splitagem(response.globalCommands)}`)
    //objectGlobal.setAttribute('data', response.globalCommands)


    // Coloca classe de resultado inativo no comando delete, atribui um id e insere os resultados que o NMT devolveu dentro do object
    objectDelete.setAttribute('class', 'resultado-inativo')
    objectDelete.setAttribute('id', 'resultado-delete')
    objectDelete.setAttribute('data', `http://10.0.30.244:4000/files/${modifyURL = await splitagem(response.deleteCommands)}`)
    //objectDelete.setAttribute('data', response.deleteCommands)

    // Cria div para aceitar os botões
    const divButtons = document.createElement('div')
    divButtons.setAttribute('class', 'botoes-resultado')

    // Cria os botões
    const interfaceButton = document.createElement('button')
    const globalButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    // Adiciona evento onclick em cada botão para chamar a função resultsButton que mostra o comando referente ao botão
    interfaceButton.setAttribute('id', 'interface-button')
    interfaceButton.setAttribute('class', 'home-buttons')
    interfaceButton.setAttribute('onclick', 'resultsButton(event)')
    interfaceButton.textContent = 'Comandos Interface'

    globalButton.setAttribute('id', 'global-button')
    globalButton.setAttribute('class', 'home-buttons')
    globalButton.setAttribute('onclick', 'resultsButton(event)')
    globalButton.textContent = 'Comandos Globais'

    deleteButton.setAttribute('id', 'delete-button')
    deleteButton.setAttribute('class', 'home-buttons')
    deleteButton.setAttribute('onclick', 'resultsButton(event)')
    deleteButton.textContent = 'Comandos Delete'

    // Adiciona os botões na div de botões
    divButtons.append(interfaceButton, globalButton, deleteButton)

    // Adiciona as divs de cada comando e a div de botões na div resultado
    result.append(objectInterface, objectGlobal, objectDelete, divButtons)
}

/*Função GAMBIARA para funcionar no mobile*/
async function splitagem(url){
    const urlRecived = url
    console.log(urlRecived)
    const urlFinaly = urlRecived.split('/')[4]
    console.log(urlFinaly)

    return urlFinaly
} 

// Alterna entre os comandos
function resultsButton(e) {

    // Pega as divs de cada tipo de comando
    const interfaceDiv = document.getElementById('resultado-interface')
    const globalDiv = document.getElementById('resultado-global')
    const deleteDiv = document.getElementById('resultado-delete')

    // Compara qual foi o botão clicado, mostra sua div e esconde as outras duas alterando a classe
    if (e.target.id == 'interface-button') {
        interfaceDiv.setAttribute('class', 'resultado-ativo')
        globalDiv.setAttribute('class', 'resultado-inativo')
        deleteDiv.setAttribute('class', 'resultado-inativo')
    }

    if (e.target.id == 'global-button') {
        globalDiv.setAttribute('class', 'resultado-ativo')
        interfaceDiv.setAttribute('class', 'resultado-inativo')
        deleteDiv.setAttribute('class', 'resultado-inativo')
    }
    if (e.target.id == 'delete-button') {
        deleteDiv.setAttribute('class', 'resultado-ativo')
        globalDiv.setAttribute('class', 'resultado-inativo')
        interfaceDiv.setAttribute('class', 'resultado-inativo')
    }
}

// Valida se todos os registros estão selecionados e salva o primeiro registro
async function continueButton() {
    
    const olt = document.getElementById('select-olt-destination').value
    const slot = document.getElementById('select-slot-destination').value
    const port = document.getElementById('select-port-destination').value
    const name = document.getElementById('file-name').value


    // Pega todos os inputs do tipo checkbox com id #select-item e me retorna um nodeList
    const checkboxes = document.querySelectorAll('#select-item')

    // Loopa por todos os elementos type checkbox confirmando se estão ativos
    let confirmechecked = []
    checkboxes.forEach((check) => {
        if(check.checked == false) {   // Se houver algum checkbox que não esteja ativo, ele é inserido no array confirmechecked
        confirmechecked.push(check)
        }
    })

    //Se tiver algum elemento sem preencher ele retorna um alert, se não prossegue com o programa
    if (confirmechecked.length > 0) { 
        return window.alert('Preencha selecione todas as ONUS para prosseguir')
          
    }else if (!slot || !port || !olt || !name){
        return window.alert('Preencha o F/S/P e o nome do arquivo para prosseguir')
    }
    
    await saveAttenuation()
    // Chama função nextAttenuation

}

async function saveAttenuation() {
    if(totalOnts.length <= 0 && allAttenuations.length) return alert("Nenhuma ONU foi encontrada")

    let attenuation = {}
    let offline = []
    let online = []
    //let controlAttenuation = allAttenuations.length

    if(allAttenuations == 0){

        totalOnts.forEach(onu => {
            if(onu.status == 1) online.push(onu)
            if(onu.status == 2) offline.push(onu)
        })

        attenuation.nameAttenuation = "Primeiro Registro"
        attenuation.offline = offline
        attenuation.online = online

        allAttenuations.push(attenuation)

        //Limpando as listas
        attenuation = {}
        while(offline.length > 0){
            offline.pop()
        }
        while(online.length > 0){
            online.pop()
        }
    }

    //
    //Chama a função que cria a tabela de atenuações
    /*
    if(allAttenuations > 0){
        let countAttenuation = allAttenuations.length
        attenuation.nameAttenuation = `${countAttenuation++}º Atenuacao`
    }

    console.log(allAttenuations)
    */
}


function createTableAttenuation() {
    
    let confirAttenuation
    //Salva o valor da table em variável
    const table = document.getElementById('table-attenuations')
    
    //Verificando se já existe um algum elemento filho da tabela

    if (table.childNodes.length == 1){

        //Criando as linhas e colunas da tabela
        const row = document.createElement('tr')
        const td = document.createElement('td')
        row.setAttribute('id', 'row-results')

        //Adicionando um texto e uma class em cada celula da coluna
        td.textContent = 'Registro Original'
        td.setAttribute('id', 'original-register')
        confirAttenuation = 'Registro Original'
        //td.setAttribute('onclick', `printResult([${arrayOntsResult}])`);
        td.setAttribute('onclick', `printAttenuation('${confirAttenuation}')`)

        // Adiciona todos os elementos td na row e depois adiciona a row na table
        row.append(td)
        table.append(row)  
        

    } else {
        
      
        const row = document.querySelector('#results')
        const td = document.createElement('td')
        //Atribuindo o número de atenuações a uma variável
        let num = row.childNodes.length

        //Percorrendo o array de atenuações e caso exista alguma atenuação que foi removida eu somo +1 na variavel num
        for (i in register.attenuations){
            if(register.attenuations[i] == "Atenuação removida"){
                num++
            }
        }
        
        //Adicionando um texto e uma class em cada celula da coluna
        td.textContent = `${num}° Atenuação`
        td.setAttribute('class', 'register-item')
        td.setAttribute('id', `${num}° Atenuação`)
        verifAttenus = `${num}° Atenuação`
        console.log('VerifiAtt' + verifAttenus)
        td.setAttribute('onclick', `printAttenuation('${verifAttenus}')`)
        //td.setAttribute('onclick', `printResult([${arrayOntsResult}])`)
        

        // Adiciona a row na table  
        row.append(td)
    }
}





//Gera um botão para que o usuario não possa alterar o F/S/P e OLT
async function nextAttenuation(){
   

    document.getElementById('origem-container').style.display = 'none'
    const div = document.querySelector('.btn-next-att')
    const button = document.createElement('button')
    button.textContent = 'Clique aqui para ir para próxima atenuação'
    button.setAttribute('id', 'btn-next-att')
    button.setAttribute('onclick', 'searchButton()')

    div.append(button)


    const table = document.getElementById('table')
    let tableChild  = table.childNodes

    //Percorrendo a tebele e adiconadno classes as linhas, clase adiconada para remoção dos elementos com a função cleanRegister
    for(let i = 2; i < tableChild.length; i++){
        let removeNode = tableChild[i]
        if(removeNode.classList) removeNode.classList.add("remove-register")
    }

    cleanRegister()
    createFileName()

}


// Chamando a função de Pegar as ONUS (getOnts) e Selecionando o checked dos regitros com a função  selectAlls()
async function searchButton(){
    //Escondendo a div que contem o botão finalizar
    document.querySelector('.finalizar').style.display = 'none'
    
   
    //Removendo o botão de buscar
    const confirmButton = document.getElementById('button-next-attenuation')
    if (confirmButton != null){
        confirmButton.remove()
    }
    
    let confirmExistOnt = await getOnts()
    if (confirmExistOnt == false) return console.log(false)
    selectAlls()  
    getOffline()


    //Atribuindo os elementos com a class register-item a uma variavel
    const confirmAtt = document.querySelectorAll('.register-item')
    
    //Escondendo e mostrando a gpon de acordo com o numero de atenuações
    if(confirmAtt.length <= 1){
        document.querySelector('.gpon-destino').style.display = 'flex' 
    }else{
        document.querySelector('.gpon-destino').style.display = 'none' 
    }
}


//Mostra o nome do arquivo tela
function createFileName(){
    const div = document.querySelector('.fileName')
    const inputName = document.getElementById('input-name').value
    const fileName = document.createElement('p')
   
    if(div.childNodes.length <=1){
        fileName.textContent = inputName
        fileName.setAttribute('id', 'fileName')
        div.append(fileName)
    }
    
}


// Limpa os registros da tabela e o total de ONUS
function cleanRegister(){

    //Mostrando as atenuações
    document.querySelector('.attenuations').style.display = 'flex'

    // Atribuindo todos as linhas da tabala a uma variável
    const rows = document.querySelectorAll('.selected')
    
    //Percorrendo a nodelist e removendo os regstros
    for (i = 0; i < listTd.length ; i++)
    {
        listTd[i].remove()
    }

    // Atribuindo todos os elementos com o ID count-ONUS-item a uma variável
    const listTotalOnus = document.querySelectorAll('#count-ONUS-item')

    //Percorrendo a nodelist e removendo os regstros
    for (i = 0; i < listTotalOnus.length; i++){
        listTotalOnus[i].remove()
    } 
    //Escondendo o campo do input-name
    document.querySelector('.name').style.display = 'none'



    //Atribuindo as linhas da tabela a uma variavel
    const removeRow = document.querySelectorAll('.row-attenuation')
    
    //percorre os elementos da tabela e exclui os mesmos
    for (i = 0; i < removeRow.length; i++){ 
        removeRow[i].remove()
    }

    //Atribuindo os botões à uma variável (removeButtons) e o title à variável removeSubtitle
    const removeButtons = document.querySelectorAll('.buttons-delete')
    const removeSubtitle = document.getElementById('result-attenuation')

    //verificando se o button existe
    if(removeButtons != null){
        
        //Percorrendo o nodelist e removendo os botões
        for (let button of removeButtons){
            button.remove()

        }
        //Deixando o titulo em branco
        removeSubtitle.innerHTML = ''
        buttonFinaly()
    }
    //Remove as linhas da tebela após o registro original da mesma
    const removeNode = document.querySelectorAll('.remove-register')

    for (i = 0; i < removeNode.length ; i++)
    {
        removeNode[i].remove()
    }

    //Removendo o botão finalizar
    let confirmBtn = document.getElementById('button-finish')
    if(confirmBtn != null){
        confirmBtn.remove()
    }

    //Mostrando a div button-next-attenuation
    document.getElementById('button-next-Att').style.display = 'flex'

}

// Salva os id, SNs e tipos das ONUS offlines e on e arrays e apresenta as ONUS que caíram nas atenuações na tela
async function printAttenuation (verifAttenus){   

    //Alteração temporaria para ignorar as ONUS já off originalmente
    const originOff = []
    let teste =  register.control.offline
    for(let i in teste){
        const getSN = teste[i].split(" ")[1]
        originOff.push(getSN)
    }

    
    let verifAtt
    //Escondendo as atenuações  
    document.querySelector('.tableAllregister').style.display = 'none'
    document.querySelector('.finalizar').style.display = 'none'
    
    const table = document.getElementById('attenuationResult')
    const div = document.querySelector('.buttons-confirm')
 
    //Criação dos elementos html da tabela
    const rowMain = document.createElement('tr')
    const thID = document.createElement('th')
    const Sn = document.createElement('th')
    const thstatus = document.createElement('th')
    rowMain.setAttribute('class', 'row-attenuation')
    
    //Alterando o conteudo dos elementos
    thID.textContent = 'ID'
    Sn.textContent = 'Número de série'
    thstatus.textContent = 'Status'
    rowMain.append(thID, Sn, thstatus)
    table.append(rowMain)


    const verifAttenu = verifAttenus.toString()
    if(verifAttenu == 'Registro Original'){
        console.log(verifAttenu)
    }else{  
        verifAtt = verifAttenu.split("°")[0]
        console.log(verifAtt)
    }

    let num = 0
    //Criando e salvando os elementos do registro origanal da consulta. Mostrando na tela os resultados
    if(verifAttenu == 'Registro Original'){
        
        for(let i = 0; i < register.control.offline.length; i++){
            const row = document.createElement('tr')
            const tdID = document.createElement('td')
            const Sn = document.createElement('td')
            const control = register.control.offline[i].split(" ")
            const tdStatus = 'OFFLINE' 

            row.setAttribute('class', 'row-attenuation')  
            
            tdID.textContent = control[0]
            Sn.textContent = control[1]
            console.log(tdID)
            console.log(Sn)
            
            //tdID.textContent = register.control.offline[i]

            row.style.backgroundColor = '#A9D0F5'
            row.style.color = '#FE2E64'

            row.append(tdID, Sn, tdStatus)
            table.append(row)

        }

        for(let i = 0; i < register.control.online.length; i++){
            const row = document.createElement('tr')
            const tdID = document.createElement('td')
            const Sn = document.createElement('td')
            const control = register.control.online[i].split(" ")
            
            tdID.textContent = control[0] 
            Sn.textContent = control[1]
            const tdStatus = 'ONLINE'

            row.setAttribute('class', 'row-attenuation')  
            row.append(tdID, Sn, tdStatus)
            table.append(row)

        }


        
    const h3 = document.getElementById('result-attenuation')
    h3.innerHTML = `Total de <b>${register.control.online.length + register.control.offline.length}</b>
    ONU(S), <b>${register.control.online.length}</b> Online(s) e <b>${register.control.offline.length}</b> 
    Offline(s)`


    }else{
        if(register.attenuations.length > 0){
            console.log(verifAtt + "Nmr da att")
            let countOff = register.attenuations[verifAtt -1].offline.length

            for(let i = 0; i < countOff; i++){
                console.log(`${i} passada`)
                const row = document.createElement('tr')
                const tdID = document.createElement('td')
                const Sn = document.createElement('td')
                const getAtt = register.attenuations[verifAtt -1].offline[i]
                
                let splitRegister = getAtt.toString().split(" ")
                console.log(splitRegister)
                tdID.textContent = splitRegister[0]
                Sn.textContent = splitRegister[1]
                let snConfirm = splitRegister[1] 

                //SE DER ERRO REMOVER APENAS A VALIDAÇÃO DO IF ABAIXO
                if(originOff.indexOf(snConfirm) == -1){
                    num++
                    console.log("Não achei nada")
                    const tdStatus = 'OFFLINE'
                    console.log(splitRegister)
                    console.log(tdID, Sn)
                    row.setAttribute('class', 'row-attenuation')  
                    row.style.backgroundColor = '#A9D0F5'
                    row.style.color = '#FE2E64'
                    
                    row.append(tdID, Sn, tdStatus)
                    table.append(row)

                    const h3 = document.getElementById('result-attenuation')
                    h3.innerHTML = `Nesta atenuação <b>${num}</b> ONU(S) ficaram offline`
                }

                const h3 = document.getElementById('result-attenuation')
                h3.innerHTML = `Nesta atenuação <b>${num}</b> ONU(S) ficaram offline`
                
            }

            

        }
    }

    if(verifAttenu == 'Registro Original'){
        const buttonOk = document.createElement('button')
        const buttonDelete = document.createElement('button')
        buttonOk.textContent = 'OK'
        buttonOk.setAttribute('class', 'home-buttons')
        if(buttonOk.classList) buttonOk.classList.add("buttons-delete")
        buttonOk.setAttribute('onclick', `deleteTableCreateBtn()`)

        div.append(buttonOk)

        document.querySelector('#button-next-Att').style.display = 'none'

    }else{
        const buttonOk = document.createElement('button')
        const buttonDelete = document.createElement('button')
        buttonOk.textContent = 'Manter'
        buttonOk.setAttribute('class', 'home-buttons')
        if(buttonOk.classList) buttonOk.classList.add("buttons-delete")
        buttonOk.setAttribute('onclick', `deleteTableCreateBtn()`)
    

        buttonDelete.textContent = 'Descartar'
        buttonDelete.setAttribute('class', 'home-buttons')
        if(buttonDelete.classList) buttonDelete.classList.add("buttons-delete")
        buttonDelete.setAttribute('onclick', `discardAttenuation(${verifAtt})`)
    

        div.append(buttonOk, buttonDelete)

        document.querySelector('#button-next-Att').style.display = 'none'
    
    } 
}
