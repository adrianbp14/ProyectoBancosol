document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    
    inicializarPagina();
});

async function inicializarPagina() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/cadenas');
        const cadenas = await respuesta.json();
        renderizarCadenas(cadenas);
    } catch (error) {
        console.error(error);
    }
}

function renderizarCadenas(cadenas) {
    const contenedor = document.getElementById('contenedor-cadenas');
    contenedor.innerHTML = '';

    if (cadenas.length === 0) {
        contenedor.innerHTML = '<p>No hay cadenas registradas.</p>';
        return;
    }

    cadenas.forEach(cadena => {
        const div = document.createElement('div');
        div.style.marginBottom = "10px";
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${cadena.codigo}" name="cadena" checked> 
                ${cadena.nombre} (${cadena.codigo})
            </label>
        `;
        contenedor.appendChild(div);
    });
}

async function abrirModalNuevaCadena() {
    const nombre = prompt("Nombre de la nueva cadena:");
    if (!nombre || nombre.trim() === "") return;

    const nombreUpper = nombre.toUpperCase();
    const codigo = nombreUpper.substring(0, 4).replace(/\s/g, '');

    const nuevaCadena = {
        nombre: nombreUpper,
        codigo: codigo
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/cadenas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaCadena)
        });

        if (respuesta.ok) {
            inicializarPagina();
        }
    } catch (error) {
        console.error(error);
    }
}

async function procesarGeneracionCampana() {
    const nombreCampana = document.getElementById('selectCampana').value;
    const checkboxes = document.querySelectorAll('input[name="cadena"]:checked');
    const cadenasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);

    if (cadenasSeleccionadas.length === 0) {
        alert("Debes seleccionar al menos una cadena para la campaña.");
        return;
    }

    const datosCampana = {
        nombre: nombreCampana,
        descripcion: "Cadenas participantes: " + cadenasSeleccionadas.join(", ")
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/campanas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCampana)
        });

        if (respuesta.ok) {
            alert("Campaña generada y guardada con éxito.");
            window.location.href = 'admin.html';
        }
    } catch (error) {
        alert("Error al conectar con el servidor.");
    }
}