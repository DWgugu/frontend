window.addEventListener("load", () => {
    viewServices();
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

function viewServices() {
    const table = document.getElementById("tbodyService");

    axios.get(`${apiLocal}/services`).then((response) => {
        const data = response.data;
        for(let i in data) {
            const money = parseFloat(data[i].pieceValue)
            const moneyBRL = money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            table.innerHTML += `
                <tr>
                    <td> ${data[i].id} </td>
                    <td> ${data[i].type} </td>
                    <td> ${moneyBRL} </td>
                </tr>
            `
        }
    })
}

function createService() {
    const type = document.getElementById("typeInput");
    const value = document.getElementById("valueInput");
    const typeHelp = document.getElementById("typeHelp");
    const valueHelp = document.getElementById("valuePieceHelp");

    const breakPoint = value.value.split(",")
    const convertValue = `${breakPoint[0]}.${breakPoint[1]}`;

    console.log(convertValue);

    axios.get(`${apiLocal}/services`).then((response) => {
        const data = response.data;
        for(let search of data) {
            if(search.type.toLowerCase() === type.value.toLowerCase()) {
                alertErrorEqual()
                setTimeout(() => {
                }, 2000)
                return;
            }
        }

        if(!type.value) {
            type.classList.add("alert-input")
            typeHelp.classList.remove("alert-form-not-view")
            typeHelp.classList.add("alert-form-view")
            return;
        }

        if(!value.value) {
            value.classList.add("alert-input")
            valueHelp.classList.remove("alert-form-not-view")
            valueHelp.classList.add("alert-form-view")
            return;
        }

        axios.post(`${apiLocal}/service`, {
            type: type.value,
            pieceValue: Number(convertValue)
        }).then((response) => {
            alertSuccessCreate()
            setTimeout(() => {
                location.reload()
            }, 2000)
        }).catch((error) => {
            console.log(error);
        })
    })
}

const getValue = document.getElementById("valueInput");
getValue.addEventListener('keypress', () => {
    const valueLength = getValue.value.length; 
    if(valueLength === 2) {
        getValue.value += ","
    }
})

function alertSuccessCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-success" role="alert">
            Serviço criado com sucesso
        </div>
    `
}

function alertErrorEqual() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" role="alert" id="errorAlert">
            ERROR! Serviço já existe
        </div>
    `
    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}

function logout() {
    window.location.href = "./index.html"
}