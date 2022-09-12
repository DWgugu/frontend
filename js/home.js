window.addEventListener("load", () => {
    viewDateCut();
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

function viewDateCut() {
    const tbody = document.getElementById("tbodyDateCut");

    axios.get(`${apiLocal}/cut-date`).then((response) => {
        const data = response.data;
        for(let i in data) {
            const dStartBreak = data[i].dateStart.split("T");
            const dStartBreak2 = dStartBreak[0].split("-")

            const dEndBreak = data[i].dateEnd.split("T");
            const dEndBreak2 = dEndBreak[0].split("-")

            tbody.innerHTML += `
                <tr>
                    <td> ${data[i].id} </td>
                    <td> ${dStartBreak2[2]}/${dStartBreak2[1]}/${dStartBreak2[0]} - ${dEndBreak2[2]}/${dEndBreak2[1]}/${dEndBreak2[0]} </td>
                    <td> <i class="bi bi-box-arrow-in-right icon-action" onclick="goDateCut(${data[i].id})" ></i> </td>
                </tr>
            `
        }
    })
}

function goDateCut(id) {
    localStorage.setItem("idCutDate", id);
    window.location="date-cut.html";
}

function logout() {
    window.location.href = "./index.html"
}