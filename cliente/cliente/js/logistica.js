/**
 * Lógica específica para la página de Logística
 */

document.addEventListener("DOMContentLoaded", () => {
    // Verificamos si hay token al cargar (Seguridad de cliente)
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    
    inicializarPagina();
});

// 1. Cargar y renderizar la tabla
async function inicializarPagina() {
    try {
        // Llamamos a la función de tu api.js
        const tiendas = await obtenerTiendasLogistica(); 
        const tbody = document.getElementById('tabla-tiendas');
        tbody.innerHTML = ''; 

        if (tiendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay tiendas registradas.</td></tr>';
            return;
        }

        tiendas.forEach(tienda => {
            const nombreLocalidad = tienda.localidad ? tienda.localidad.nombre : 'No definida';
            
            
            tbody.innerHTML += `
                <tr>
                    <td>${tienda.id_tienda}</td>
                    <td>${tienda.resenaNombre}</td>
                    <td>${nombreLocalidad}</td>
                    <td>
                        <button class="btn-action" onclick="abrirModal(${tienda.id_tienda}, '${tienda.resenaNombre}')">
                            Asignar
                        </button>
                    </td>
                </tr>
            `;
        });
        // 2. Cargamos los usuarios para el desplegable de la modal
        // Lo hacemos aquí para que ya estén listos cuando el usuario pulse "Asignar"
        try {
            const usuarios = await cargarUsuarios(); 
            console.log("Lo que devuelve cargarUsuarios:", usuarios); // <--- AÑADE ESTO
            const select = document.getElementById('select-coordinador');
            
            // Limpiamos el select por si acaso, manteniendo la opción por defecto
            select.innerHTML = '<option value="">-- Selecciona un perfil --</option>';
            
            usuarios.forEach(u => {
                const option = document.createElement('option');
                option.value = u.id; // El ID del usuario para enviarlo luego al backend
                option.textContent = `${u.nombre} ${u.apellidos || ''}`; // Nombre completo
                select.appendChild(option);
            });
            console.log("Usuarios cargados correctamente en el desplegable");
        } catch (errorUsuarios) {
            console.error("Error al cargar los usuarios para el select:", errorUsuarios);
        }

    } catch (error) {
        console.error("Error al cargar tiendas:", error);
        document.getElementById('tabla-tiendas').innerHTML = 
            '<tr><td colspan="4" class="error">Error al conectar con el servidor.</td></tr>';
    }
}

// 2. Control de la Modal
function abrirModal(id, nombre) {
    document.getElementById('id-tienda-modal').value = id;
    document.getElementById('nombre-tienda-modal').innerText = nombre;
    document.getElementById('modal-gestion').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal-gestion').style.display = 'none';
}

// 3. Confirmar asignación
document.getElementById('btn-confirmar-asignacion').onclick = async () => {
    const idTienda = document.getElementById('id-tienda-modal').value;
    const idCoord = document.getElementById('select-coordinador').value;
    
    if(!idCoord) {
        alert("Por favor, selecciona un coordinador.");
        return;
    }

    try {
        // Aquí llamarías a la función POST de tu api.js
        console.log(`Asignando tienda ${idTienda} a coordinador ${idCoord}`);
        alert("Asignación procesada.");
        cerrarModal();
        inicializarPagina(); 
    } catch (error) {
        alert("Error: " + error.message);
    }
};