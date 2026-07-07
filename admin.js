import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
    getAuth,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBvE1SHjQEC_gzslhCd51EGvgI0zAwgsuc",

    authDomain: "study-plus-89936.firebaseapp.com",

    projectId: "study-plus-89936",

    storageBucket: "study-plus-89936.firebasestorage.app",

    messagingSenderId: "685590718796",

    appId: "1:685590718796:web:1499dc6a21c204ce7447e9"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);



const paginas = document.querySelectorAll(".pagina");

const menus = document.querySelectorAll(".sidebar li[data-page]");


menus.forEach(menu => {

    menu.addEventListener("click", () => {

        menus.forEach(m => m.classList.remove("active"));

        menu.classList.add("active");


        paginas.forEach(p => {

            p.classList.remove("ativa");

        });


        document
            .getElementById(menu.dataset.page)
            .classList.add("ativa");


    });

});



const toast = document.getElementById("toast");

const toastTexto = document.getElementById("toastTexto");


function mostrarToast(texto) {

    toastTexto.innerText = texto;

    toast.classList.add("ativo");


    setTimeout(() => {

        toast.classList.remove("ativo");

    }, 3000);

}



onAuthStateChanged(auth, user => {


    if (!user) {

        window.location.href = "login.html";

        return;

    }


    document.getElementById("adminNome").innerText =
        user.displayName || "Administrador";


    document.getElementById("adminCargo").innerText =
        "Super Admin";


    carregarDashboard();


});



document
    .getElementById("logout")
    .addEventListener("click", () => {


        signOut(auth)
            .then(() => {

                window.location.href = "login.html";

            });


    });



async function carregarDashboard() {


    const usuarios =
        await getDocs(collection(db, "usuarios"));


    const admins =
        await getDocs(collection(db, "admins"));


    const materias =
        await getDocs(collection(db, "materias"));


    const questoes =
        await getDocs(collection(db, "questoes"));


    const simulados =
        await getDocs(collection(db, "simulados"));



    totalUsuarios.innerText =
        usuarios.size;


    totalAdmins.innerText =
        admins.size;


    totalMaterias.innerText =
        materias.size;


    totalQuestoes.innerText =
        questoes.size;


    totalSimulados.innerText =
        simulados.size;



    rUsuarios.innerText =
        usuarios.size;


    rAdmins.innerText =
        admins.size;


    rMaterias.innerText =
        materias.size;


    rQuestoes.innerText =
        questoes.size;


    rSimulados.innerText =
        simulados.size;



    carregarUltimosUsuarios();


}



async function carregarUltimosUsuarios() {


    const tabela =
        document.getElementById("ultimosUsuarios");


    tabela.innerHTML = "";


    const q =
        query(
            collection(db, "usuarios"),
            orderBy("criadoEm", "desc"),
            limit(5)
        );


    const dados =
        await getDocs(q);



    dados.forEach(usuario => {


        const u =
            usuario.data();


        tabela.innerHTML += `

        <tr>

        <td>${u.nome || "-"}</td>

        <td>${u.email || "-"}</td>

        <td>${u.criadoEm || "-"}</td>

        <td>
        <span class="status ativo">
        Ativo
        </span>
        </td>

        </tr>

        `;


    });


}



document
    .getElementById("atualizarUsuarios")
    .addEventListener("click", () => {

        carregarUltimosUsuarios();

        mostrarToast("Usuários atualizados");

    });
async function carregarUsuarios() {

    const tabela =
        document.getElementById("listaUsuarios");

    tabela.innerHTML = "";


    const dados =
        await getDocs(collection(db, "usuarios"));


    dados.forEach(usuario => {


        const u = usuario.data();


        tabela.innerHTML += `

        <tr>

            <td>${u.nome || "-"}</td>

            <td>${u.email || "-"}</td>

            <td>${u.criadoEm || "-"}</td>

            <td>
                <span class="status ativo">
                    Ativo
                </span>
            </td>

            <td>

                <div class="btn-group">

                    <button class="btn btn-ver">
                        Ver
                    </button>

                    <button 
                    class="btn btn-excluir"
                    onclick="removerUsuario('${usuario.id}')">

                    Excluir

                    </button>

                </div>

            </td>

        </tr>

        `;


    });


}



document
    .querySelector('[data-page="usuarios"]')
    .addEventListener("click", () => {

        carregarUsuarios();

    });




window.removerUsuario = async (id) => {


    await deleteDoc(
        doc(db, "usuarios", id)
    );


    mostrarToast(
        "Usuário removido"
    );


    carregarUsuarios();


};




const modalAdmin =
    document.getElementById("modalAdmin");


document
    .getElementById("abrirModalAdmin")
    .addEventListener("click", () => {


        modalAdmin.classList.add("ativo");


    });



document
    .getElementById("fecharModal")
    .addEventListener("click", () => {


        modalAdmin.classList.remove("ativo");


    });



document
    .getElementById("cancelarAdmin")
    .addEventListener("click", () => {


        modalAdmin.classList.remove("ativo");


    });




document
    .getElementById("salvarAdmin")
    .addEventListener("click", async () => {


        const nome =
            adminNomeInput.value;


        const email =
            adminEmailInput.value;


        const senha =
            adminSenhaInput.value;


        const cargo =
            adminRoleInput.value;



        try {


            const novo =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    senha
                );



            await setDoc(
                doc(db, "admins", novo.user.uid),
                {

                    nome,
                    email,
                    cargo,
                    criadoEm:
                        new Date().toLocaleDateString()

                }
            );



            mostrarToast(
                "Administrador criado"
            );


            modalAdmin.classList.remove("ativo");


            carregarAdmins();



        } catch (e) {


            mostrarToast(
                "Erro ao criar administrador"
            );


        }


    });





async function carregarAdmins() {


    const tabela =
        document.getElementById("listaAdmins");


    tabela.innerHTML = "";



    const dados =
        await getDocs(collection(db, "admins"));



    dados.forEach(admin => {


        const a =
            admin.data();


        tabela.innerHTML += `


        <tr>


            <td>${a.nome}</td>


            <td>${a.email}</td>


            <td>${a.cargo}</td>


            <td>

                <span class="status ativo">
                    Ativo
                </span>

            </td>


            <td>

                <button 
                class="btn btn-excluir"
                onclick="removerAdmin('${admin.id}')">

                Excluir

                </button>

            </td>


        </tr>


        `;


    });


}




window.removerAdmin = async (id) => {


    await deleteDoc(
        doc(db, "admins", id)
    );


    mostrarToast(
        "Administrador removido"
    );


    carregarAdmins();


};



document
    .querySelector('[data-page="admins"]')
    .addEventListener("click", () => {

        carregarAdmins();

    });






async function carregarMaterias() {


    const tabela =
        document.getElementById("listaMaterias");


    tabela.innerHTML = "";



    const dados =
        await getDocs(collection(db, "materias"));



    dados.forEach(item => {


        const m =
            item.data();



        tabela.innerHTML += `


        <tr>


            <td>
            ${m.nome || "-"}
            </td>


            <td>
            ${m.questoes || 0}
            </td>


            <td>

            <button class="btn btn-editar">
            Editar
            </button>


            <button 
            class="btn btn-excluir"
            onclick="removerMateria('${item.id}')">

            Excluir

            </button>


            </td>


        </tr>


        `;


    });


}




window.removerMateria = async (id) => {


    await deleteDoc(
        doc(db, "materias", id)
    );


    mostrarToast(
        "Matéria removida"
    );


    carregarMaterias();


};



document
    .querySelector('[data-page="materias"]')
    .addEventListener("click", () => {

        carregarMaterias();

    });
async function carregarQuestoes() {


    const tabela =
        document.getElementById("listaQuestoes");


    tabela.innerHTML = "";



    const dados =
        await getDocs(collection(db, "questoes"));



    dados.forEach(item => {


        const q =
            item.data();



        tabela.innerHTML += `


        <tr>


            <td>
            ${q.titulo || "-"}
            </td>


            <td>
            ${q.materia || "-"}
            </td>


            <td>
            ${q.dificuldade || "-"}
            </td>


            <td>


                <button class="btn btn-editar">
                Editar
                </button>


                <button 
                class="btn btn-excluir"
                onclick="removerQuestao('${item.id}')">

                Excluir

                </button>


            </td>


        </tr>


        `;


    });


}



window.removerQuestao = async (id) => {


    await deleteDoc(
        doc(db, "questoes", id)
    );


    mostrarToast(
        "Questão removida"
    );


    carregarQuestoes();


};



document
    .querySelector('[data-page="questoes"]')
    .addEventListener("click", () => {

        carregarQuestoes();

    });







async function carregarSimulados() {


    const tabela =
        document.getElementById("listaSimulados");


    tabela.innerHTML = "";



    const dados =
        await getDocs(collection(db, "simulados"));



    dados.forEach(item => {


        const s =
            item.data();



        tabela.innerHTML += `


        <tr>


            <td>
            ${s.nome || "-"}
            </td>


            <td>
            ${s.questoes || 0}
            </td>


            <td>
            ${s.tempo || "-"}
            </td>


            <td>


            <button class="btn btn-editar">
            Editar
            </button>


            <button 
            class="btn btn-excluir"
            onclick="removerSimulado('${item.id}')">

            Excluir

            </button>


            </td>


        </tr>


        `;


    });


}





window.removerSimulado = async (id) => {


    await deleteDoc(
        doc(db, "simulados", id)
    );


    mostrarToast(
        "Simulado removido"
    );


    carregarSimulados();


};





document
    .querySelector('[data-page="simulados"]')
    .addEventListener("click", () => {


        carregarSimulados();


    });









document
    .getElementById("enviarAviso")
    .addEventListener("click", async () => {


        const titulo =
            document.getElementById("tituloAviso").value;


        const mensagem =
            document.getElementById("mensagemAviso").value;



        if (!titulo || !mensagem) {


            mostrarToast(
                "Preencha todos os campos"
            );


            return;

        }




        await addDoc(
            collection(db, "avisos"),
            {

                titulo,
                mensagem,

                data:
                    new Date().toLocaleDateString()

            }
        );



        document.getElementById("tituloAviso").value = "";

        document.getElementById("mensagemAviso").value = "";



        mostrarToast(
            "Aviso enviado"
        );



    });









document
    .getElementById("salvarConfig")
    .addEventListener("click", async () => {


        const nome =
            document.getElementById("nomeSistema").value;


        const mensagem =
            document.getElementById("mensagemInicial").value;


        const manutencao =
            document.getElementById("modoManutencao").value;




        await setDoc(

            doc(db, "config", "geral"),

            {

                nome,

                mensagem,

                manutencao:
                    manutencao === "true"

            }

        );



        mostrarToast(
            "Configurações salvas"
        );


    });









document
    .getElementById("pesquisarUsuario")
    .addEventListener("input", (e) => {


        const termo =
            e.target.value.toLowerCase();



        document
            .querySelectorAll("#listaUsuarios tr")
            .forEach(linha => {


                linha.style.display =
                    linha.innerText
                        .toLowerCase()
                        .includes(termo)
                        ?
                        ""
                        :
                        "none";


            });


    });







document
    .getElementById("pesquisarAdmin")
    .addEventListener("input", (e) => {


        const termo =
            e.target.value.toLowerCase();



        document
            .querySelectorAll("#listaAdmins tr")
            .forEach(linha => {


                linha.style.display =
                    linha.innerText
                        .toLowerCase()
                        .includes(termo)
                        ?
                        ""
                        :
                        "none";


            });


    });








document
    .getElementById("novaMateria")
    .addEventListener("click", async () => {


        const nome =
            prompt("Nome da matéria:");



        if (!nome)
            return;



        await addDoc(
            collection(db, "materias"),
            {

                nome,

                questoes: 0

            }

        );


        mostrarToast(
            "Matéria adicionada"
        );


        carregarMaterias();


    });








document
    .getElementById("novaQuestao")
    .addEventListener("click", async () => {


        const titulo =
            prompt("Título da questão:");



        if (!titulo)
            return;



        await addDoc(
            collection(db, "questoes"),
            {

                titulo,

                materia: "Geral",

                dificuldade: "Média"

            }

        );



        mostrarToast(
            "Questão adicionada"
        );


        carregarQuestoes();


    });








document
    .getElementById("novoSimulado")
    .addEventListener("click", async () => {


        const nome =
            prompt("Nome do simulado:");



        if (!nome)
            return;



        await addDoc(
            collection(db, "simulados"),
            {

                nome,

                questoes: 0,

                tempo: "60 minutos"

            }

        );



        mostrarToast(
            "Simulado criado"
        );


        carregarSimulados();


    });







document
    .getElementById("novoAviso")
    .addEventListener("click", () => {


        document
            .getElementById("tituloAviso")
            .focus();


    });





window.addEventListener("load", () => {


    carregarDashboard();


});