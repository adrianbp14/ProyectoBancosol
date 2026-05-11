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
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";
        div.style.padding = "5px";
        div.style.borderBottom = "1px solid #eee";
        
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${cadena.codigo}" name="cadena" checked> 
                ${cadena.nombre} (${cadena.codigo})
            </label>
            <div>
                <button onclick="modificarCadena(${cadena.idCadena}, '${cadena.nombre}')" 
                        style="background: none; border: none; color: #ffc107; cursor: pointer; font-size: 0.8rem; margin-right: 10px;">
                    Editar
                </button>
                <button onclick="eliminarCadena(${cadena.idCadena})" 
                        style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.8rem;">
                    Eliminar
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

async function añadirCadenaDesdeInput() {
    const input = document.getElementById('nuevoNombreCadena');
    const nombre = input.value;

    if (!nombre || nombre.trim() === "") {
        alert("Por favor, escribe un nombre para la cadena.");
        return;
    }

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
            input.value = ''; 
            inicializarPagina(); 
        } else {
            alert("Error al guardar en el servidor. Asegúrate de que el Backend está corriendo.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

async function modificarCadena(id, nombreActual) {
    const nuevoNombre = prompt("Nuevo nombre para la cadena:", nombreActual);
    if (!nuevoNombre || nuevoNombre.trim() === "" || nuevoNombre === nombreActual) return;

    const nombreUpper = nuevoNombre.toUpperCase();
    const codigo = nombreUpper.substring(0, 4).replace(/\s/g, '');

    const datosActualizados = {
        idCadena: id,
        nombre: nombreUpper,
        codigo: codigo
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/cadenas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (respuesta.ok) {
            inicializarPagina();
        }
    } catch (error) {
        console.error(error);
    }
}

async function eliminarCadena(id) {
    if (!confirm("¿Seguro que quieres eliminar esta cadena de la base de datos?")) return;

    try {
        const respuesta = await fetch(`http://localhost:8080/api/cadenas/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            inicializarPagina();
        } else {
            alert("No se ha podido eliminar la cadena.");
        }
    } catch (error) {
        console.error("Error al borrar:", error);
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