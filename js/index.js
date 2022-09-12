const apiLocal = "https://back-zipy.herokuapp.com"

function login(event) {
    event.preventDefault();
    const userInput = document.getElementById('userInput');
    const passwordInput = document.getElementById('passwordInput');

    axios.post(apiLocal + '/login', {
        user: userInput.value,
        password: passwordInput.value
    }).then((response) => {
        const dataUser = response.data;
        console.log(dataUser);
        localStorage.setItem('idUserLogged', JSON.stringify(dataUser.userAuthenticate.id));
        location.href = './home.html';
    }).catch((error)=>{
        alertErrorLogin();
        userInput.focus();
        console.log(error);
    }) 
}

function alertErrorLogin() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" role="alert" id="errorAlert">
            ERROR! Usuário ou senha incorretos
        </div>
    `
    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}