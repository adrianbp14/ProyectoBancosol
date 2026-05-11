document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    
    inicializarPagina();
});

async function inicializarPagina() {
    try {
        const cadenasIniciales = [
            { nombre: 'LIDL', codigo: 'LIDL' },
            { nombre: 'MERCADONA', codigo: 'MERC' },
            { nombre: 'CARREFOUR', codigo: 'CARR' },
            { nombre: 'DIA', codigo: 'DIA' },
            { nombre: 'EL CORTE INGLES', codigo: 'ECI' },
            { nombre: 'EL JAMON', codigo: 'ELJA' }
        ];

        renderizarCadenas(cadenasIniciales);
    } catch (error) {
        console.error(error);
    }
}

function renderizarCadenas(cadenas) {
    const contenedor = document.getElementById('contenedor-cadenas');
    contenedor.innerHTML = '';

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

function abrirModalNuevaCadena() {
    const nombre = prompt("Nombre de la nueva cadena:");
    
    if (nombre && nombre.trim() !== "") {
        const nombreUpper = nombre.toUpperCase();
        const codigo = nombreUpper.substring(0, 4).replace(/\s/g, '');
        
        const contenedor = document.getElementById('contenedor-cadenas');
        const div = document.createElement('div');
        div.style.marginBottom = "10px";
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${codigo}" name="cadena" checked> 
                ${nombreUpper} (${codigo})
            </label>
        `;
        contenedor.appendChild(div);
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
        cadenas: cadenasSeleccionadas,
        fechaCreacion: new Date().toISOString()
    };

    try {
        alert(`Campaña ${nombreCampana} preparada con ${cadenasSeleccionadas.length} cadenas.`);
        console.log(datosCampana);
    } catch (error) {
        alert("Error en la conexión con el servidor.");
    }
}