/**
 * Lógica específica para el panel de visualización del Capitán
 */

// Extraemos el ID del usuario logueado de forma genérica
const ID_USUARIO_LOGUEADO = sessionStorage.getItem('id_usuario');

// Extraemos el rol, limpiándolo de tildes y pasándolo a mayúsculas para evitar fallos de coincidencia
const ROL_USUARIO_LOGUEADO = sessionStorage.getItem('rol')
    ? sessionStorage.getItem('rol').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : '';

document.addEventListener("DOMContentLoaded", () => {
    // Verificación preventiva de sesión activa
    if (!sessionStorage.getItem('token')) {
        console.warn("No se encontró token de sesión. Redirigiendo al login...");
        window.location.href = 'index.html';
        return;
    }

    // Control de acceso por rol (Capitán o Administrador de apoyo)
    if (!ROL_USUARIO_LOGUEADO.includes('CAPITAN') && !ROL_USUARIO_LOGUEADO.includes('ADMIN')) {
        alert("No tienes permisos para acceder a esta sección.");
        window.location.href = 'index.html';
        return;
    }

    // Lanzamos la carga de datos de la base de datos
    cargarTiendasYVoluntarios();
});

/**
 * Recupera del backend y renderiza las tiendas del capitán actual con sus respectivos voluntarios
 */
async function cargarTiendasYVoluntarios() {
    const tbody = document.getElementById('tabla-tiendas-capitan');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando tus tiendas asignadas...</td></tr>';

    // Verificación de seguridad del ID recuperado
    if (!ID_USUARIO_LOGUEADO) {
        console.error("Error: ID_USUARIO_LOGUEADO es null o undefined.");
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Error interno: No se pudo identificar al usuario logueado.</td></tr>';
        return;
    }

    const urlEndpoint = `http://localhost:8080/api/capitanes/${ID_USUARIO_LOGUEADO}/tiendas-voluntarios`;
    console.log("Iniciando petición fetch a:", urlEndpoint);

    try {
        const respuesta = await fetch(urlEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Estado de la respuesta del servidor:", respuesta.status, respuesta.statusText);

        if (!respuesta.ok) {
            throw new Error(`El servidor respondió con código de error: ${respuesta.status}`);
        }

        const tiendas = await respuesta.json();
        console.log("Datos recibidos del backend con éxito:", tiendas);

        tbody.innerHTML = ''; // Limpiamos el indicador visual de carga

        if (!tiendas || tiendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tienes ninguna tienda asignada actualmente.</td></tr>';
            return;
        }

        // Renderizado dinámico de las tiendas devueltas por el DTO
        tiendas.forEach(tienda => {
            // Tolerancia de campos: Mapea correctamente si el JSON viene en snake_case (DB) o camelCase (Java)
            const idTienda = tienda.id_tienda !== undefined ? tienda.id_tienda : tienda.idTienda;
            const resenaNombre = tienda.resena_nombre !== undefined ? tienda.resena_nombre : tienda.resenaNombre;
            const domicilio = tienda.domicilio || 'Sin dirección';
            const codigoPostal = tienda.codigo_postal !== undefined ? tienda.codigo_postal : tienda.codigoPostal;

            // Protección estructural: Evita que el programa rompa si la lista viene vacía o nula
            let listaVoluntarios = [];
            if (tienda.voluntarios && Array.isArray(tienda.voluntarios)) {
                listaVoluntarios = tienda.voluntarios;
            } else if (tienda.listaVoluntarios && Array.isArray(tienda.listaVoluntarios)) {
                listaVoluntarios = tienda.listaVoluntarios;
            }

            const numVoluntarios = listaVoluntarios.length;
            const direccionCompleta = `${domicilio}, ${codigoPostal || ''}`;

            // 1. Inyección de la fila principal de la Tienda
            const filaTiendaHtml = `
                <tr id="tienda-${idTienda}">
                    <td><strong>${idTienda || 'N/A'}</strong></td>
                    <td>${resenaNombre || 'Sin nombre'}</td>
                    <td>${direccionCompleta}</td>
                    <td><span class="badge-voluntarios">${numVoluntarios} Voluntarios</span></td>
                    <td>
                        <button class="btn-action" style="background-color: #34495e;" onclick="alternarDesplegable(${idTienda})">
                            Ver Voluntarios
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', filaTiendaHtml);

            // 2. Construcción de las filas internas de voluntarios para el acordeón
            let filasVoluntariosHtml = '';
            if (numVoluntarios === 0) {
                filasVoluntariosHtml = '<tr><td colspan="4" style="text-align:center; color:#7f8c8d;">No hay voluntarios asignados a esta tienda todavía.</td></tr>';
            } else {
                listaVoluntarios.forEach(vol => {
                    filasVoluntariosHtml += `
                        <tr>
                            <td>${vol.nombre || 'Sin nombre'} ${vol.apellidos || ''}</td>
                            <td>${vol.telefono || 'No disponible'}</td>
                            <td>${vol.email || 'No disponible'}</td>
                            <td><span style="color: #27ae60; font-weight: bold;">✔ Asignado</span></td>
                        </tr>
                    `;
                });
            }

            // 3. Inyección de la subtabla desplegable (oculta por defecto)
            const filaDesplegableHtml = `
                <tr id="desplegable-${idTienda}" class="fila-voluntarios" style="display: none;">
                    <td colspan="5">
                        <div class="contenedor-voluntarios">
                            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Equipo de Voluntarios en: ${resenaNombre}</h4>
                            <table class="tabla-interna">
                                <thead>
                                    <tr>
                                        <th>Nombre Completo</th>
                                        <th>Teléfono</th>
                                        <th>Email de Contacto</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${filasVoluntariosHtml}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', filaDesplegableHtml);
        });

    } catch (error) {
        console.error("Error capturado en la función cargarTiendasYVoluntarios:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="error" style="text-align:center; color: red;">Error al conectar con el servidor backend.</td></tr>';
    }
}

/**
 * Muestra u oculta la subtabla de voluntarios de una tienda concreta (Efecto acordeón)
 */
function alternarDesplegable(idTienda) {
    const filaDesplegable = document.getElementById(`desplegable-${idTienda}`);
    if (filaDesplegable) {
        if (filaDesplegable.style.display === "none") {
            filaDesplegable.style.display = "table-row";
        } else {
            filaDesplegable.style.display = "none";
        }
    }
}