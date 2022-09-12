window.addEventListener("load", () => {
    renderTitle();
    listClients();
    viewClientsAdd();
    userHeader();
})

const apiLocal = "https://back-zipy.herokuapp.com"

function backHome() {
    window.location="home.html";
}

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

function viewClientsAdd() {
    const dateCut = document.getElementById("tbodyDateCut");
    const idUser = parseInt(localStorage.getItem("idUserLogged"));
    const idCutDate = parseInt(localStorage.getItem("idCutDate"));
    //console.log(idUser);

    axios.get(`${apiLocal}/client-input`).then((response) => {
        const data = response.data;
        for(let i in data) {
            //console.log(data[i].client);
            if(data[i].userId === idUser && data[i].cutDateId === idCutDate) {
                //console.log(data[i].client);
                dateCut.innerHTML += `
                    <tr>
                        <td> ${data[i].id} </td>
                        <td> ${data[i].client.client} </td>
                        <td> <i class="bi bi-box-arrow-in-right icon-action" onclick=" goClientWorking(${data[i].id})" ></i> </td>
                    </tr>
                `
            }
        };
    }).catch((error) => {
        console.log(error);
    })
}

function listClients() {
    const idCutDate = parseInt(localStorage.getItem("idCutDate"));
    const idUser = parseInt(localStorage.getItem("idUserLogged"));
    const table = document.getElementById("tbodyClientModal");

    let list = [];

    axios.get(`${apiLocal}/clients`).then((response) => {
        const dataClient = response.data;
        axios.get(`${apiLocal}/client-input`).then((response) => {
            const dataClientInput = response.data;

            for(let c = 0; c < dataClient.length; c++) {
                list.push({
                    id: dataClient[c].id,
                    client: dataClient[c].client
                })

                for(let ci = 0; ci < dataClientInput.length; ci++) {
                    if(dataClientInput[ci].cutDateId === idCutDate && dataClientInput[ci].userId === idUser) {
                        if(dataClient[c].id === dataClientInput[ci].clientId) {
                            list.pop(dataClient[c].id);
                        }
                    };
                }

            }

            for(let i in list) {
                //console.log(list[i]);
                table.innerHTML += `
                    <tr>
                        <td> ${list[i].client} </td>
                        <td> <i class="bi bi-plus-circle-fill icon-action" onclick="addList(${list[i].id})"></i> </td>
                    </tr>
                `
            }

        })

    })

}

function addList(idClient) {
    const idCutDate = parseInt(localStorage.getItem("idCutDate"));
    const idUser = parseInt(localStorage.getItem("idUserLogged"));

    axios.post(`${apiLocal}/client-input`, {
        cutDateId: idCutDate,
        clientId: idClient,
        userId: idUser
    }).then((response) => {
        alertSuccessCreate();
        setTimeout(() => {
            location.reload();
        }, 1500);
    }).catch((error) => {

    })
}

function goClientWorking(id) {
    localStorage.setItem("idClientWorking", id);
    window.location="client-working.html";
}

function alertSuccessCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-success" role="alert">
            Cliente adicionado com sucesso
        </div>
    `
}

function goReport() {
    window.location = "relatorio.html";
}

function back() {
    window.location = "home.html";
}

function logout() {
    window.location.href = "./index.html"
}