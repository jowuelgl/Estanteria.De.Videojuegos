const STORAGE = "estanteria_v4";
let juegos = JSON.parse(localStorage.getItem(STORAGE) || "[]");
let seleccionado = null;
let modo = "estanteria";

const escena = document.getElementById("escena-frontal");
const sndOpen = document.getElementById("sndOpen");
const sndClose = document.getElementById("sndClose");

function guardar() {
    localStorage.setItem(STORAGE, JSON.stringify(juegos));
}

/* =========================
   RENDER DE ESTANTERÍA
========================= */
function render() {
    document.querySelectorAll(".balda-contenido").forEach(b => b.innerHTML = "");

    juegos.forEach((j, i) => {
        const c = document.createElement("div");
        c.className = `caja ${j.plataforma}`;
        c.onclick = () => primerClick(i);

        // 👉 APLICAR IMAGEN A LA CAJA
        if (j.imagen) {
            c.style.backgroundImage = `url(${j.imagen})`;
            c.style.backgroundSize = "cover";
            c.style.backgroundPosition = "center";
        }

        document
            .querySelector(`.balda-contenido[data-plataforma="${j.plataforma}"]`)
            .appendChild(c);
    });
}

render();

/* =========================
   CLICK EN JUEGO
========================= */
function primerClick(i) {
    if (modo !== "estanteria") return;
    seleccionado = i;
    modo = "frente";
    mostrarFrente();
}

/* =========================
   MOSTRAR CAJA ABIERTA
========================= */
function mostrarFrente() {
    const j = juegos[seleccionado];
    escena.classList.remove("oculto");

    document.getElementById("detalle-titulo").textContent = j.titulo;
    document.getElementById("detalle-plataforma").textContent = j.plataforma;
    document.getElementById("detalle-progreso").textContent = j.progreso;
    document.getElementById("barra-progreso").style.width = j.progreso + "%";
    document.getElementById("detalle-horas").textContent = j.horas;

    actualizarFrente();

    sndOpen.currentTime = 0;
    sndOpen.play();
}

/* =========================
   GUARDAR EN ESTANTERÍA
========================= */
escena.addEventListener("dblclick", () => {
    if (modo !== "frente") return;
    modo = "estanteria";
    escena.classList.add("oculto");

    sndClose.currentTime = 0;
    sndClose.play();
});

/* =========================
   EDITAR JUEGO
========================= */
document.getElementById("btnEditar").onclick = () => {
    const j = juegos[seleccionado];
    titulo.value = j.titulo;
    plataforma.value = j.plataforma;
    progreso.value = j.progreso;
    horas.value = j.horas;

    document.getElementById("modal-formulario").style.display = "flex";
};

/* =========================
   GUARDAR FORMULARIO
========================= */
document.getElementById("btnGuardar").onclick = () => {
    const j = juegos[seleccionado];

    j.titulo = titulo.value;
    j.plataforma = plataforma.value;
    j.progreso = +progreso.value || 0;
    j.horas = +horas.value || 0;

    const file = document.getElementById("imagen").files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            j.imagen = e.target.result;
            guardar();
            render();
            actualizarFrente();
        };
        reader.readAsDataURL(file);
    } else {
        guardar();
        render();
        actualizarFrente();
    }

    document.getElementById("imagen").value = "";
    document.getElementById("modal-formulario").style.display = "none";
};

/* =========================
   CANCELAR FORMULARIO
========================= */
document.getElementById("btnCancelar").onclick = () => {
    document.getElementById("modal-formulario").style.display = "none";
};

/* =========================
   AÑADIR NUEVO JUEGO
========================= */
document.getElementById("btnMostrarFormulario").onclick = () => {
    seleccionado = juegos.length;
    juegos.push({
        titulo: "",
        plataforma: "ps4",
        progreso: 0,
        horas: 0,
        imagen: null
    });

    document.getElementById("modal-formulario").style.display = "flex";
};

/* =========================
   ACTUALIZAR CD
========================= */
function actualizarFrente() {
    if (seleccionado === null) return;

    const j = juegos[seleccionado];

    /* ===== CD / CARÁTULA ===== */
    const cdLabel = document.getElementById("cd-label");

    if (j.imagen) {
        cdLabel.style.backgroundImage = `url(${j.imagen})`;
        cdLabel.style.backgroundSize = "cover";
        cdLabel.style.backgroundPosition = "center";
        cdLabel.textContent = "";
    } else {
        cdLabel.style.backgroundImage = "";
        cdLabel.textContent = j.titulo;
    }

    /* ===== TEXTO Y BARRA DE PROGRESO (LO QUE FALLABA) ===== */
    document.getElementById("detalle-progreso").textContent = j.progreso;
    document.getElementById("barra-progreso").style.width = j.progreso + "%";

    /* ===== HORAS ===== */
    document.getElementById("detalle-horas").textContent = j.horas;
}
