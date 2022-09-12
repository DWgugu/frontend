window.addEventListener("load", () => {
    renderTitle();
    viewClient();
    viewServicesDD();
    viewDateWorking();
    calculateValueAndQuantity();
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

function renderTitle() {
    const title = document.getElementById("cutDateTitle");
    const idCutDate = parseInt(localStorage.getItem("idCutDate"))

    axios.get(`${apiLocal}/cut-date/${idCutDate}`).then((response) => {
        const data = response.data;

        const dStartBreak = data.dateStart.split("T");
        const dStartBreak2 = dStartBreak[0].split("-")

        const dEndBreak = data.dateEnd.split("T");
        const dEndBreak2 = dEndBreak[0].split("-")

        title.innerHTML = `
            ${dStartBreak2[2]}/${dStartBreak2[1]}/${dStartBreak2[0]} - ${dEndBreak2[2]}/${dEndBreak2[1]}/${dEndBreak2[0]}
        `
    })
}

function viewClient() {
    const client = document.getElementById("infoClient");
    const idUser = parseInt(localStorage.getItem("idUserLogged"));
    const idClientInput = parseInt(localStorage.getItem("idClientWorking"));
    //console.log(idUser);

    axios.get(`${apiLocal}/client-input/${idClientInput}`).then((response) => {
        const data = response.data;
        //console.log(data);
        client.innerHTML = data.client.client
    }).catch((error) => {
        console.log(error);
    })
}

function viewServicesDD() {
    const dropdown = document.getElementById("drop-service")

    axios.get(`${apiLocal}/services`).then((response) => {
        const data = response.data;
        //console.log(data);
        for(let i in data) {
            dropdown.innerHTML += `
                <li><a class="dropdown-item" href="#" onclick="getValue(${data[i].id})" >${data[i].type}</a></li>
            ` 
        };
    })
}

let idService = [];

function getValue(id) {
    const service = document.getElementById("serviceSelected");

    axios.get(`${apiLocal}/service/${id}`).then((response) => {
        const data = response.data;
        //console.log(data);
        service.innerHTML = data.type;
        idService = {
            id: data.id,
            value: data.pieceValue
        }
        console.log(idService);
    })
}

function addWorked() {
    const idClientInput = parseInt(localStorage.getItem("idClientWorking"));
    const date = document.getElementById("date");
    const quantity = document.getElementById("quantity");

    if(!date.value) {
        alertErrorCreate();
        date.classList.add("alert-input");
    } else if(!quantity.value) {
        alertErrorCreate();
        quantity.classList.add("alert-input");
    } else if(idService.length <= 0) {
        alertErrorDD();
    } else {
        axios.post(`${apiLocal}/worked-date`, {
            pieceValue: idService.value,
            quantity: quantity.value,
            date: date.value,
            serviceId: idService.id,
            clientInputId: idClientInput
        }).then((response) => {
            alertSuccessCreate();
            setTimeout(() => {
                location.reload();
            }, 2000)
        })
    }
}

function viewDateWorking() {
    const dateCut = document.getElementById("tbodyDateWorking");
    const idClientInput = parseInt(localStorage.getItem("idClientWorking"));
    //console.log(idUser);

    axios.get(`${apiLocal}/worked-date`).then((response) => {
        const data = response.data;
        for(let i in data) {
            console.log(data[i]);
            const date = data[i].date.split("T");
            const dateBreak = date[0].split("-");
            const newDate = `${dateBreak[2]}/${dateBreak[1]}/${dateBreak[0]}`

            if(data[i].clientInputId === idClientInput) {

                const totalValue = data[i].quantity * data[i].pieceValue;
                const money = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                console.log(totalValue);
                dateCut.innerHTML += `
                    <tr>
                        <td> ${newDate} </td>
                        <td> ${data[i].service.type} </td>
                        <td> ${data[i].quantity} pçs </td>
                        <td> ${money} </td>  
                    </tr>
                `
            }
        };
    }).catch((error) => {
        console.log(error);
    })
}

function calculateValueAndQuantity() {
    const value = document.getElementById("infoValue");
    const quantity = document.getElementById("infoQuantity");
    const idClientInput = parseInt(localStorage.getItem("idClientWorking"));

    axios.get(`${apiLocal}/worked-date`).then((response) => {
        const data = response.data;
        let totalValue = 0;
        let totalQuantity = 0;

        for(let i in data) {

            if(data[i].clientInputId === idClientInput) {

                const sumValue = data[i].quantity * data[i].pieceValue;
                const totalMoney = totalValue += sumValue;
                const money = totalMoney.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                value.innerHTML = money;

                const sumQuantity = totalQuantity += data[i].quantity;
                quantity.innerHTML = `${sumQuantity} pçs`;

            }
        };
    }).catch((error) => {
        console.log(error);
    })
};

function alertSuccessCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-success" role="alert">
            Data de serviço adicionado com sucesso
        </div>
    `
}

function alertErrorCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" id="errorAlert" role="alert">
            ATENÇÃO! Campo em vermelho obrigatório
        </div>
    `

    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}

function alertErrorDD() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" id="errorAlert" role="alert">
            ATENÇÃO! Você deve selecionar um serviço
        </div>
    `

    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}

function back() {
    window.location = "date-cut.html";
}

function logout() {
    window.location.href = "./index.html"
}