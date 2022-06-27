async function consultBD() {


    const opt = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // Envia dados para o backgroud
    let responseLogin = await fetch('login', opt)

    // Recebe a resposta do background
    responseLogin = await responseLogin.json()
}