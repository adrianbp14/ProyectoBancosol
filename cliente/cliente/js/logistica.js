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
                    <td>${tienda.resena_nombre}</td>
                    <td>${nombreLocalidad}</td>
                    <td>
                        <button class="btn-action" onclick="abrirModal(${tienda.id_tienda}, '${tienda.resena_nombre}')">
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
    
    // Por ahora, usamos el ID 1 (Primavera) o 2 (Gran Recogida) 
    // hasta que tengamos un selector de campaña en el HTML
    const idCampana = 1; 
    
    if(!idCoord) {
        alert("Por favor, selecciona un coordinador.");
        return;
    }

    try {
        // Llamamos a la función de api.js con los 3 parámetros
        await asignarCoordinadorTienda(idTienda, idCoord, idCampana);
        
        alert("¡Asignación guardada con éxito en la tabla de coordinadores!");
        cerrarModal();
        inicializarPagina(); // Recarga la tabla para ver cambios
    } catch (error) {
        if (error.message.includes("duplicate") || error.message.includes("exists")) {
            alert("⚠️ Esta tienda ya tiene un coordinador asignado para esta campaña.");
        } else {
        console.error("Error al asignar:", error);
        alert("Error: " + error.message);
        }
    }
};