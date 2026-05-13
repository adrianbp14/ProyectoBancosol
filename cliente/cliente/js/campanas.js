document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    
    inicializarPagina();
});

function obtenerCabeceras() {
    const token = sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, 
        'token': token 
    };
}

async function inicializarPagina() {
    const contenedor = document.getElementById('contenedor-cadenas');
    contenedor.innerHTML = '<p style="color: #666;">Conectando con el servidor...</p>';

    try {
        const respuesta = await fetch('http://localhost:8080/api/cadenas', {
            headers: obtenerCabeceras()
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            contenedor.innerHTML = `<p style="color: red;"><strong>Error del servidor (${respuesta.status}):</strong> ${errorTexto}</p>`;
            return;
        }

        const cadenas = await respuesta.json();

        // Comprobación vital: ¿De verdad es una lista?
        if (!Array.isArray(cadenas)) {
            contenedor.innerHTML = `<p style="color: red;"><strong>Error de formato:</strong> El servidor no ha devuelto una lista. Ha devuelto esto: ${JSON.stringify(cadenas)}</p>`;
            return;
        }

        renderizarCadenas(cadenas);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p style="color: red;"><strong>Error de conexión:</strong> ¿Está el backend (Spring Boot) encendido? Detalles: ${error.message}</p>`;
    }
}

function renderizarCadenas(cadenas) {
    const contenedor = document.getElementById('contenedor-cadenas');
    contenedor.innerHTML = '';

    if (cadenas.length === 0) {
        contenedor.innerHTML = '<p>No hay cadenas registradas en la base de datos.</p>';
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
            headers: obtenerCabeceras(),
            body: JSON.stringify(nuevaCadena)
        });

        if (respuesta.ok) {
            input.value = ''; 
            inicializarPagina(); 
        } else {
            alert(`Error al guardar: Código de servidor ${respuesta.status}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor al añadir.");
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
            headers: obtenerCabeceras(),
            body: JSON.stringify(datosActualizados)
        });

        if (respuesta.ok) {
            inicializarPagina();
        } else {
            alert(`Error al modificar: Código de servidor ${respuesta.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

async function eliminarCadena(id) {
    if (!confirm("¿Seguro que quieres eliminar esta cadena de la base de datos?")) return;

    try {
        const respuesta = await fetch(`http://localhost:8080/api/cadenas/${id}`, {
            method: 'DELETE',
            headers: obtenerCabeceras()
        });

        if (respuesta.ok) {
            inicializarPagina();
        } else {
            alert(`No se ha podido eliminar. Código de servidor: ${respuesta.status}`);
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
        tipoCampana: nombreCampana, // Ajustado para que coincida con Java
        anio: 2026,                 // Ajustado para que coincida con Java
        descripcion: "Cadenas participantes: " + cadenasSeleccionadas.join(", ")
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/campanas', {
            method: 'POST',
            headers: obtenerCabeceras(),
            body: JSON.stringify(datosCampana)
        });

        if (respuesta.ok) {
            alert("Campaña generada y guardada con éxito en Supabase.");
            window.location.href = 'admin.html';
        } else {
            alert(`Error al guardar campaña: Código de servidor ${respuesta.status}`);
        }
    } catch (error) {
        console.error(error);
        alert("Error crítico en la conexión.");
    }
}