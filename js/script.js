const API_URL = "https://script.google.com/macros/s/AKfycbwOJIZJ1aDYv9WBop6hqAf7JJ6IK349wcYhWYHUkGcdYca3FxBWPta9smRpfdzX5HZc/exec";

let juegos = [];
let seleccionado = null;
let estado = "estanteria";

const escena = document.getElementById("escena-frontal");

/* =====================
   CARGAR DESDE SHEETS
===================== */
async function cargarJuegos() {
  const res = await fetch(API_URL);
  juegos = await res.json();
  render();
}
cargarJuegos();

/* =====================
   RENDER
===================== */
function render() {
  document.querySelectorAll(".balda-contenido").forEach(b => b.innerHTML = "");

  juegos.forEach((j, i) => {
    const caja = document.createElement("div");
    caja.className = `caja ${j.plataforma}`;
    caja.onclick = () => clickCaja(i);

    if (j.imagen) {
      caja.style.backgroundImage = `url(${j.imagen})`;
      caja.style.backgroundSize = "cover";
      caja.style.backgroundPosition = "center";
    }

    document
      .querySelector(`.balda-contenido[data-plataforma="${j.plataforma}"]`)
      ?.appendChild(caja);
  });
}

/* =====================
   CLICK 2 PASOS
===================== */
function clickCaja(i) {
  seleccionado = i;

  if (estado === "estanteria") {
    estado = "frente";
    mostrarFrente();
    return;
  }

  if (estado === "frente") {
    estado = "abierta";
  }
}

/* =====================
   MOSTRAR FRENTE
===================== */
function mostrarFrente() {
  const j = juegos[seleccionado];
  escena.classList.remove("oculto");

  detalle_titulo.textContent = j.titulo;
  detalle_plataforma.textContent = j.plataforma;
  detalle_progreso.textContent = j.progreso;
  barra_progreso.style.width = j.progreso + "%";
  detalle_horas.textContent = j.horas;
}

/* =====================
   EDITAR
===================== */
btnEditar.onclick = () => {
  const j = juegos[seleccionado];

  titulo.value = j.titulo;
  plataforma.value = j.plataforma;
  progreso.value = j.progreso;
  horas.value = j.horas;

  modal_formulario.style.display = "flex";
};

/* =====================
   GUARDAR
===================== */
btnGuardar.onclick = async () => {
  const j = juegos[seleccionado];

  j.titulo = titulo.value;
  j.plataforma = plataforma.value;
  j.progreso = +progreso.value || 0;
  j.horas = +horas.value || 0;

  const action = j.id ? "update" : "add";
  if (!j.id) j.id = Date.now();

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...j })
  });

  modal_formulario.style.display = "none";
  cargarJuegos();
};

/* =====================
   NUEVO
===================== */
btnMostrarFormulario.onclick = () => {
  seleccionado = juegos.length;
  juegos.push({
    titulo: "",
    plataforma: "ps4",
    progreso: 0,
    horas: 0,
    imagen: ""
  });
  modal_formulario.style.display = "flex";
};

