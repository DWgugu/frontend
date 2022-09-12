window.addEventListener("load", () => {
    userHeader();
    viewReport();
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

function viewReport() {
    const idCutDate = parseInt(localStorage.getItem("idCutDate"));
    const idUser = parseInt(localStorage.getItem("idUserLogged"));
    const tbody = document.getElementById("tbodyReport");
    const quantity = document.getElementById("quantityTotal");
    const value = document.getElementById("valueTotal");

    axios.get(`${apiLocal}/generate/${idCutDate}/${idUser}`).then((response) => {
        const data = response.data;

        let totalValue = 0;
        let totalQuantity = 0;

        for(let i in data) {

            const convert = parseFloat(data[i].valor)
            const money = convert.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            tbody.innerHTML += `
                <tr>
                    <td> ${data[i].cliente} </td>
                    <td> ${data[i].quantidade} pçs </td>
                    <td> ${money} </td>
                </tr>
            `

            const sumQuantity = totalQuantity += Number(data[i].quantidade);
            quantity.innerHTML = `${sumQuantity} pçs`;

            const sumValue = totalValue += Number(data[i].valor);
            value.innerHTML = sumValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    })
}

function generateExcel() {
    let a = document.createElement('a');
    const idCutDate = parseInt(localStorage.getItem("idCutDate"));
    const idUser = parseInt(localStorage.getItem("idUserLogged"));

    axios.get(`${apiLocal}/generate-xlsx/${idCutDate}/${idUser}`).then((response) => {
        a.href= apiLocal + '/generate-xlsx/' + idCutDate + "/" + idUser;
        a.click();
        alertSuccessCreate();
        setTimeout(() => {
            location.reload();
        }, 2000)
    }).catch((error) => {
        alertErrorCreate();
    })
}

function back() {
    window.location = "date-cut.html";
}

function alertErrorCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-danger" id="errorAlert" role="alert">
            OPS ALGO DE ERRADO! Sua planilha não foi gerada
        </div>
    `
}

function alertSuccessCreate() {
    const alerts = document.getElementById("alerts");

    alerts.innerHTML = `
        <div class="alert alert-success" id="errorAlert" role="alert">
            Planilha gerada com sucesso
        </div>
    `

    setTimeout(() => {
        document.getElementById("errorAlert").setAttribute("style", "display: none")
    }, 2000)
}

function logout() {
    window.location.href = "./index.html"
}