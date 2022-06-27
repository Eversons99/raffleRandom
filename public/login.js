async function login(){
    const email = document.getElementById('username').value
    const password = document.getElementById('password').value

    const dataLogin = {
        email: email,
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

    if(responseLogin.status == "Email incorreto") alert('Email incorreto')
    if(responseLogin.status == "Senha incorreta") alert('Senha incorreta')
    if(responseLogin.status == "Login efetuado com sucesso") {

    }

}