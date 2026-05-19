/**
 * Lógica específica para el panel de visualización global del Administrador
 */

const ROL_USUARIO_LOGUEADO = sessionStorage.getItem('rol')
    ? sessionStorage.getItem('rol').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : '';

document.addEventListener("DOMContentLoaded", () => {
    // Protección de ruta
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    // Filtro estricto de seguridad: Solo entra el Admin
    if (!ROL_USUARIO_LOGUEADO.includes('ADMIN')) {
        alert("Acceso denegado: Se requieren permisos de Administrador.");
        window.location.href = 'index.html';
        return;
    }

    cargarCatalogoGlobal();
});

/**
 * Pide al backend todas las tiendas del sistema con sus capitanes y voluntarios
 */
async function cargarCatalogoGlobal() {
    const tbody = document.getElementById('tabla-tiendas-admin');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando mapa general de logística...</td></tr>';

    const urlEndpoint = `http://localhost:8080/api/admin/todas-tiendas-voluntarios`;
    console.log("Admin fetch lanzado a:", urlEndpoint);

    try {
        const respuesta = await fetch(urlEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la respuesta del servidor: ${respuesta.status}`);
        }

        const tiendas = await respuesta.json();
        tbody.innerHTML = '';

        if (!tiendas || tiendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay tiendas dadas de alta en el sistema.</td></tr>';
            return;
        }

        tiendas.forEach(tienda => {
            // Tolerancia de mapeo camelCase / snake_case
            const idTienda = tienda.id_tienda !== undefined ? tienda.id_tienda : tienda.idTienda;
            const resenaNombre = tienda.resena_nombre !== undefined ? tienda.resena_nombre : tienda.resenaNombre;
            const domicilio = tienda.domicilio || 'Sin dirección';
            const codigoPostal = tienda.codigo_postal !== undefined ? tienda.codigo_postal : tienda.codigoPostal;
            const capitan = tienda.nombre_capitan !== undefined ? tienda.nombre_capitan : (tienda.nombreCapitan || 'Sin asignar');

            let listaVoluntarios = tienda.voluntarios || [];
            const numVoluntarios = listaVoluntarios.length;
            const direccionCompleta = `${domicilio}, ${codigoPostal || ''}`;

            // 1. Fila principal de la tienda (Incluye celda de capitán)
            const filaTiendaHtml = `
                <tr id="tienda-${idTienda}">
                    <td><strong>${idTienda}</strong></td>
                    <td>${resenaNombre}</td>
                    <td>${direccionCompleta}</td>
                    <td><span class="badge-capitan">👤 ${capitan}</span></td>
                    <td><span class="badge-voluntarios">${numVoluntarios} Voluntarios</span></td>
                    <td>
                        <button class="btn-action" style="background-color: #34495e;" onclick="alternarDesplegable(${idTienda})">
                            Ver Voluntarios
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', filaTiendaHtml);

            // 2. Filas del acordeón de voluntarios
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
                            <td><span style="color: #27ae60; font-weight: bold;">✔ Confirmado</span></td>
                        </tr>
                    `;
                });
            }

            // 3. Subtabla desplegable de voluntarios
            const filaDesplegableHtml = `
                <tr id="desplegable-${idTienda}" class="fila-voluntarios" style="display: none;">
                    <td colspan="6">
                        <div class="contenedor-voluntarios">
                            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Equipo de Voluntarios asignados</h4>
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
        console.error("Error cargando el panel de administración:", error);
        tbody.innerHTML = '<tr><td colspan="6" class="error" style="text-align:center; color: red;">Error al conectar con el servidor backend.</td></tr>';
    }
}

/**
 * Control del acordeón desplegable
 */
function alternarDesplegable(idTienda) {
    const filaDesplegable = document.getElementById(`desplegable-${idTienda}`);
    if (filaDesplegable) {
        filaDesplegable.style.display = (filaDesplegable.style.display === "none") ? "table-row" : "none";
    }
}