let materiales = [];
let canasta = [];

// ELEMENTOS DEL HTML
const lista = document.getElementById("lista");
const buscador = document.getElementById("buscador");
const contador = document.getElementById("contador");

const btnCanasta = document.getElementById("btnCanasta");
const contadorCanasta = document.getElementById("contadorCanasta");

const modalCanasta = document.getElementById("modalCanasta");
const cerrarCanasta = document.getElementById("cerrarCanasta");
const btnCerrarAbajo = document.getElementById("btnCerrarAbajo");

const contenedorCanasta = document.getElementById("canasta");
const totalCanasta = document.getElementById("totalCanasta");

const btnWhatsApp = document.getElementById("btnWhatsApp");


// ==========================================
// CARGAR CATÁLOGO
// ==========================================

async function cargarCatalogo() {

    try {

        const respuesta = await fetch("./catalogo.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo encontrar catalogo.json");
        }

        materiales = await respuesta.json();

        mostrar(materiales);
        mostrarCanasta();

    } catch (error) {

        console.error(error);

        lista.innerHTML = `
            <div class="note">
                <strong>No se pudo cargar el catálogo.</strong><br>
                Verifica que el archivo catalogo.json esté
                en la misma carpeta que index.html.
            </div>
        `;
    }
}


// ==========================================
// MOSTRAR MATERIALES
// ==========================================

function mostrar(datos) {

    contador.textContent =
        datos.length + " materiales encontrados";

    if (datos.length === 0) {

        lista.innerHTML = `
            <div class="note">
                No encontramos materiales con esa búsqueda.
            </div>
        `;

        return;
    }

    lista.innerHTML = datos.map(material => {

        return `
            <div class="card">

                <div class="informacion-material">

                    <div class="code">
                        ${escapar(material.codigo)}
                    </div>

                    <div class="desc">
                        ${escapar(material.descripcion)}
                    </div>

                </div>

                <button
                    class="btn-agregar"
                    onclick="agregarCanasta('${escaparAtributo(material.codigo)}')"
                >
                    🛒 Agregar
                </button>

            </div>
        `;

    }).join("");
}


// ==========================================
// AGREGAR MATERIAL
// ==========================================

function agregarCanasta(codigo) {

    const material = materiales.find(
        material => material.codigo === codigo
    );

    if (!material) {
        return;
    }

    const existente = canasta.find(
        item => item.codigo === codigo
    );

    if (existente) {

        existente.cantidad++;

    } else {

        canasta.push({

            codigo: material.codigo,

            descripcion: material.descripcion,

            cantidad: 1

        });
    }

    mostrarCanasta();

    // Abrir automáticamente la solicitud
    abrirCanasta();
}


// ==========================================
// MOSTRAR CANASTA
// ==========================================

function mostrarCanasta() {

    // Calcular cantidad total
    const totalUnidades = canasta.reduce(
    (suma, item) => suma + item.cantidad,
    0
    );

    const totalMateriales = canasta.length;

    contadorCanasta.textContent = totalMateriales;

    totalCanasta.textContent =
      totalMateriales +
     (totalMateriales === 1 ? " material" : " materiales");


    if (canasta.length === 0) {

        contenedorCanasta.innerHTML = `
            <div class="canasta-vacia">
                Todavía no has agregado materiales.
            </div>
        `;

        return;
    }


    contenedorCanasta.innerHTML = canasta.map(item => {

        return `
            <div class="item-canasta">

                <div class="datos-item">

                    <div class="codigo-item">
                        ${escapar(item.codigo)}
                    </div>

                    <div class="descripcion-item">
                        ${escapar(item.descripcion)}
                    </div>

                </div>


                <div class="control-cantidad">

                    <button
                        class="btn-cantidad"
                        onclick="cambiarCantidad('${escaparAtributo(item.codigo)}', -1)"
                    >
                        −
                    </button>

                    <input
                        class="input-cantidad"
                        type="number"
                        min="1"
                        value="${item.cantidad}"
                        onchange="ponerCantidad('${escaparAtributo(item.codigo)}', this.value)"
                    >

                    <button
                        class="btn-cantidad"
                        onclick="cambiarCantidad('${escaparAtributo(item.codigo)}', 1)"
                    >
                        +
                    </button>

                </div>


                <button
                    class="btn-eliminar"
                    onclick="eliminarCanasta('${escaparAtributo(item.codigo)}')"
                >
                    🗑
                </button>

            </div>
        `;

    }).join("");
}


// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function cambiarCantidad(codigo, cambio) {

    const item = canasta.find(
        item => item.codigo === codigo
    );

    if (!item) {
        return;
    }

    item.cantidad += cambio;

    if (item.cantidad <= 0) {

        canasta = canasta.filter(
            item => item.codigo !== codigo
        );
    }

    mostrarCanasta();
}


// ==========================================
// ESCRIBIR CANTIDAD DIRECTAMENTE
// ==========================================

function ponerCantidad(codigo, cantidad) {

    const item = canasta.find(
        item => item.codigo === codigo
    );

    if (!item) {
        return;
    }

    let nuevaCantidad = parseInt(cantidad);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }

    item.cantidad = nuevaCantidad;

    mostrarCanasta();
}


// ==========================================
// ELIMINAR MATERIAL
// ==========================================

function eliminarCanasta(codigo) {

    canasta = canasta.filter(
        item => item.codigo !== codigo
    );

    mostrarCanasta();
}


// ==========================================
// BUSCADOR
// ==========================================

buscador.addEventListener("input", () => {

    const texto =
        buscador.value.toLowerCase().trim();

    const filtrados = materiales.filter(material => {

        const codigo =
            String(material.codigo).toLowerCase();

        const descripcion =
            String(material.descripcion).toLowerCase();

        return (
            codigo.includes(texto) ||
            descripcion.includes(texto)
        );
    });

    mostrar(filtrados);
});


// ==========================================
// ABRIR CANASTA
// ==========================================

function abrirCanasta() {

    modalCanasta.classList.add("mostrar");
}


// ==========================================
// CERRAR CANASTA
// ==========================================

function cerrarModal() {

    modalCanasta.classList.remove("mostrar");
}


// BOTÓN SUPERIOR

btnCanasta.addEventListener("click", () => {

    abrirCanasta();

});


// BOTÓN X

cerrarCanasta.addEventListener("click", () => {

    cerrarModal();

});


// BOTÓN SEGUIR AGREGANDO

btnCerrarAbajo.addEventListener("click", () => {

    cerrarModal();

});


// CERRAR SI SE HACE CLICK FUERA DE LA VENTANA

modalCanasta.addEventListener("click", (evento) => {

    if (evento.target === modalCanasta) {

        cerrarModal();

    }

});


// ==========================================
// WHATSAPP
// ==========================================

btnWhatsApp.addEventListener("click", () => {

    // Verificar materiales
    if (canasta.length === 0) {

        alert("Primero agrega materiales a la solicitud.");

        return;
    }


    // Obtener datos
    const solicitante =
        document.getElementById("solicitante").value.trim();

    const planta =
        document.getElementById("planta").value.trim();

    const zona =
        document.getElementById("zona").value.trim();


    // Verificar solicitante
    if (!solicitante) {

        alert("Por favor escribe el nombre del técnico o ingeniero.");

        document.getElementById("solicitante").focus();

        return;
    }


    // Verificar planta
    if (!planta) {

        alert("Por favor escribe la planta.");

        document.getElementById("planta").focus();

        return;
    }


    // Verificar zona
    if (!zona) {

        alert("Por favor escribe la zona o área.");

        document.getElementById("zona").focus();

        return;
    }


    // ==========================================
    // CREAR MENSAJE
    // ==========================================

    let mensaje = "";

    mensaje += "*SOLICITUD DE MATERIALES*\n\n";

    mensaje += "*Solicitante:* " + solicitante + "\n";

    mensaje += "*Planta:* " + planta + "\n";

    mensaje += "*Zona / Área:* " + zona + "\n\n";

    mensaje += "*MATERIALES SOLICITADOS*\n\n";


    // ==========================================
    // AGREGAR MATERIALES
    // ==========================================

    canasta.forEach((item, indice) => {

        mensaje +=
            (indice + 1) + ". " +
            item.descripcion + "\n";

        mensaje +=
            "   Código: " +
            item.codigo + "\n";

        mensaje +=
            "   Cantidad: " +
            item.cantidad + "\n\n";

    });


    // ==========================================
    // TOTAL
    // ==========================================

    const total = canasta.reduce(
        (suma, item) => suma + item.cantidad,
        0
    );


    mensaje +=
        "*Total de unidades:* " +
        total + "\n\n";

    mensaje +=
        "Solicitud generada desde el sistema de materiales.";


    // ==========================================
    // NÚMERO DE WHATSAPP
    // ==========================================

    const numero = "573209816813";


    // ==========================================
    // CREAR ENLACE
    // ==========================================

    const url =
        "https://wa.me/" +
        numero +
        "?text=" +
        encodeURIComponent(mensaje);


    // Abrir WhatsApp
    window.open(url, "_blank");

});
// ==========================================
// SEGURIDAD
// ==========================================

function escapar(texto) {

    return String(texto)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escaparAtributo(texto) {

    return String(texto)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}


// ==========================================
// INICIAR
// ==========================================

cargarCatalogo();

