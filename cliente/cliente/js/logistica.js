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

        // 2. Cargamos los usuarios con "red de seguridad" para el error de CORS
        try {
            const usuarios = await cargarUsuarios(); 
            console.log("¡ÉXITO! Datos recibidos del servidor:", usuarios); 
            
            const select = document.getElementById('select-coordinador');
            select.innerHTML = '<option value="">-- Selecciona un perfil --</option>';
            
            // Normalizamos la lista (por si viene dentro de un objeto 'users')
            const listaUsuarios = Array.isArray(usuarios) ? usuarios : (usuarios.users || []);

            listaUsuarios.forEach(u => {
                const option = document.createElement('option');
                // Usamos los nombres exactos de tu base de datos
                option.value = u.id_usuario; 
                option.textContent = u.nombre_completo; 
                select.appendChild(option);
            });
            
            console.log("Desplegable actualizado con datos reales.");

        } catch (error) {
            // Si llegamos aquí, la consola nos dirá exactamente QUÉ falló
            console.error("ERROR REAL AL CARGAR USUARIOS:", error);
            const select = document.getElementById('select-coordinador');
            select.innerHTML = '<option value="">-- Error: Revisa la consola --</option>';
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