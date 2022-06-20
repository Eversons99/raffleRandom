async function login(){
    const email = document.getElementById('username').value.toLowerCase()
    const password = document.getElementById('password').value

    console.log(email)
    const dataLogin = {
        email:  email,
        password: password
    }

    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            dataLogin
        )
    }
    
    // Envia dados para o backgroud
    let responseLogin = await fetch('login', opt)
        
    // Recebe a resposta do background
    responseLogin = await responseLogin.json()

    console.log(responseLogin)
    if(responseLogin.status){
        alert(responseLogin.status)
    }

    if(responseLogin == "Login efetuado com sucesso") console.log()//chamar a função que reinderizara os pagamentos
}