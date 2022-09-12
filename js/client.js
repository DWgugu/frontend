window.addEventListener("load", () => {
    viewClients();
    userHeader();
})

const apiLocal = "https://back-zipy.herokuapp.com"

function userHeader() {
    const userDiv = document.getElementById("userLogged");
    const userId = parseInt(localStorage.getItem("idUserLogged"));

    axios.get(`${apiLocal}/user/${userId}`).then((response) => {
        userDiv.innerHTML = response.data.user;
    }).catch((error) => {
        console.log(error);
    });
};

function viewClients() {
    const tbody = document.getElementById("tbodyClient");

    axios.get(`${apiLocal}/clients`).then((response) => {
        const data = response.data;
        for(let i in data) {

            tbody.innerHTML += `
                <tr>
                    <td> ${data[i].id} </td>
                    <td> ${data[i].client} </td>
                </tr>
            `
        }
    })
}

function createClient() {
    const clientInput = document.getElementById("clientInput");
    const clientHelp = document.getElementById("clientHelp");

    axios.get(`${apiLocal}/clients`).then((response) => {
        const data = response.data;

        for(let search of data) {
            if(search.client.toLowerCase() === clientInput.value.toLowerCase()) {
                alertErrorEqual();
                return;
            }
        }

        if(!clientInput.value) {
            clientInput.classList.add("alert-input")
            clientHelp.classList.remove("alert-form-not-view")
            clientHelp.classList.add("alert-form-view")
        } else {
            axios.post(`${apiLocal}/client`, {
                client: clientInput.value
            }).then((response) => {
                alertSuccessCreate();
                setTimeout(() => {
                    location.reload();
                }, 2000)
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}

function alertSuccessCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-success" role="alert">
            Cliente criado com sucesso
        </div>
    `
}

function alertErrorEqual() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" role="alert" id="errorAlert">
            ERROR! Cliente já existe
        </div>
    `
    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}

function logout() {
    window.location.href = "./index.html"
}