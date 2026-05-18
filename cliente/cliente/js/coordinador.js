const ID_COORDINADOR_LOGUEADO = parseInt(sessionStorage.getItem('id_coordinador')) || 1;
const ROL_USUARIO_LOGUEADO = sessionStorage.getItem('rol') || 'COORDINADOR'; 
let tiendaSeleccionadaId = null;

document.addEventListener("DOMContentLoaded", async () => {
    // Primero cargamos las campañas
    await cargarCampanasEnSelector();
    
    const selectCampana = document.getElementById('select-campana-coord');
    // Cargamos tiendas con la campaña seleccionada por defecto
    if(selectCampana && selectCampana.value) {
        cargarTiendasAsignadas(ID_COORDINADOR_LOGUEADO, selectCampana.value);
    }

    // Evento al cambiar de campaña
    if (selectCampana) {
        selectCampana.addEventListener('change', (e) => {
            cargarTiendasAsignadas(ID_COORDINADOR_LOGUEADO, e.target.value);
            document.getElementById('panel-turnos').style.display = 'none';
        });
    }
});

async function cargarCampanasEnSelector() {
    try {
        const campanas = await obtenerCampanas();
        const select = document.getElementById('select-campana-coord');
        select.innerHTML = '';
        
        if(campanas.length === 0) {
            select.innerHTML = '<option value="">No hay campañas disponibles</option>';
            return;
        }
        
        campanas.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id_campana || c.idCampana || c.id; 
            option.textContent = c.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar campañas:", error);
    }
}

async function cargarTiendasAsignadas(idCoordinador, idCampana) {
    const tbody = document.getElementById('tabla-mis-tiendas');
    try {
        const res = await fetch(`${API_BASE}/api/coordinadores/${idCoordinador}/tiendas?rol=${ROL_USUARIO_LOGUEADO}&idCampana=${idCampana}`);
        if (!res.ok) throw new Error("No se pudieron cargar las tiendas");
        const tiendas = await res.json();

        tbody.innerHTML = '';
        if(tiendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No tienes tiendas asignadas en esta campaña.</td></tr>';
            return;
        }

        tiendas.forEach(t => {
            const idReal = t.id_tienda || t.idTienda || t.id;
            const nombreReal = t.resena_nombre || t.resenaNombre || t.nombre || "Tienda Desconocida";
            const direccionReal = t.direccion || t.domicilio || "Sin dirección";
            const localidadReal = (t.localidad && t.localidad.nombre) ? t.localidad.nombre : "Localidad no definida";

            let capitanStr = '<em>Sin asignar</em>';
            if (t.usuario) {
                capitanStr = t.usuario.nombre_completo || t.usuario.nombre || "Capitán asignado";
            }

            tbody.innerHTML += `
                <tr>
                    <td><strong>${nombreReal}</strong></td>
                    <td>${direccionReal} (${localidadReal})</td>
                    <td>${capitanStr}</td>
                    <td>
                        <button class="btn-action" style="background-color: #2980b9;" onclick="verTurnosTienda(${idReal}, '${nombreReal}')">📅 Ver Turnos</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>';
    }
}

// Variable global para la campaña actual (Asegúrate de que el ID 1 exista en tu tabla Campana)
const ID_CAMPANA_ACTUAL = 1; 

async function verTurnosTienda(idTienda, nombreTienda) {
    tiendaSeleccionadaId = idTienda;
    document.getElementById('nombre-tienda-seleccionada').innerText = nombreTienda;
    document.getElementById('panel-turnos').style.display = 'block';

    const contenedor = document.getElementById('contenedor-turnos-dinamicos');
    contenedor.innerHTML = '<p style="text-align:center;">Cargando cuadrante...</p>';

    try {
        // Llamamos al nuevo endpoint de tu LogisticaController
        const resTurnos = await fetch(`${API_BASE}/api/logistica/tiendas/${idTienda}/turnos`);
        const turnos = await resTurnos.json();

        const resColabs = await fetch(`${API_BASE}/api/voluntarios/disponibles`);
        const voluntarios = await resColabs.json();

        contenedor.innerHTML = '';

        if (turnos.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#7f8c8d;">No hay turnos registrados para esta tienda en la base de datos.</p>';
            return;
        }

        turnos.forEach(turno => {
            // Verificamos si hay voluntarios asignados para ponerlo en verde o rojo
            const hayVoluntarios = turno.voluntarios.length > 0;
            const badgeClass = hayVoluntarios ? 'badge-success' : 'badge-danger';
            const badgeTexto = hayVoluntarios ? 'Con Voluntarios' : 'Vacante';
            
            // Pintamos la lista de nombres de los voluntarios apuntados
            let htmlVoluntarios = '';
            if (hayVoluntarios) {
                turno.voluntarios.forEach(v => {
                    htmlVoluntarios += `
                        <div style="font-size: 13px; color: #2c3e50; display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span>👤 ${v.nombre}</span>
                            <span style="cursor:pointer; color:#e74c3c;" onclick="eliminarVoluntario(${turno.idTurno}, ${v.idVoluntario})" title="Eliminar del turno">❌</span>
                        </div>`;
                });
            } else {
                htmlVoluntarios = '<div style="font-size: 13px; color: #95a5a6;"><em>Nadie asignado aún</em></div>';
            }

            // Opciones del desplegable
            let opcionesSelect = `<option value="">-- Añadir Voluntario --</option>`;
            voluntarios.forEach(v => {
                opcionesSelect += `<option value="${v.id_voluntario || v.idVoluntario}">${v.nombre} ${v.apellidos || ''}</option>`;
            });

            contenedor.innerHTML += `
                <div style="background: #fdfdfd; padding: 12px; margin-bottom: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>⏰ ${turno.franjaHoraria}</strong>
                        <span class="badge ${badgeClass}">${badgeTexto}</span>
                    </div>
                    <div style="margin-bottom: 10px; padding-left: 5px; border-left: 3px solid #3498db;">
                        ${htmlVoluntarios}
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <select id="select-turno-${turno.idTurno}" style="padding: 5px; flex: 1; border-radius: 4px; border: 1px solid #ccc;">
                            ${opcionesSelect}
                        </select>
                        <button class="btn-confirm" style="padding: 5px 10px; font-size:12px;" onclick="asignarColaboradorATurno(${turno.idTurno})">Añadir</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="color:red; font-size:12px;">Error al cargar el cuadrante de turnos.</p>';
    }
}

async function asignarColaboradorATurno(idTurnoBase) {
    const idVoluntario = document.getElementById(`select-turno-${idTurnoBase}`).value;
    if(!idVoluntario) {
        alert("Selecciona un voluntario del desplegable primero.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/logistica/asignar-voluntario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idTienda: tiendaSeleccionadaId, 
                idVoluntario: parseInt(idVoluntario),
                idCampana: document.getElementById('select-campana-coord').value 
            })
        });

        const respuestaTexto = await res.text();

        if(res.ok) {
            alert("¡Voluntario añadido al turno correctamente!");
            // Recargamos el panel lateral para que aparezca su nombre al instante
            verTurnosTienda(tiendaSeleccionadaId, document.getElementById('nombre-tienda-seleccionada').innerText);
        } else if (res.status === 409 || respuestaTexto.includes("duplicate")) {
            alert("⚠️ Aviso: Ese voluntario ya estaba apuntado a esta tienda.");
        } else {
            throw new Error(respuestaTexto);
        }
    } catch (e) {
        alert("Error al asignar: " + e.message);
    }
}

// 5. CONTROL DE LA MODAL DE COLABORADORES
function abrirModalColaborador() { document.getElementById('modal-colaborador').style.display = 'block'; }
function cerrarModalColaborador() { document.getElementById('modal-colaborador').style.display = 'none'; }

// 6. CREAR NUEVO COLABORADOR (Petición POST)
async function guardarColaborador() {
    const payload = {
        nombre: document.getElementById('colab-nombre').value.trim(),
        apellidos: document.getElementById('colab-apellidos').value.trim(),
        telefono: document.getElementById('colab-telefono').value.trim(),
        email: document.getElementById('colab-email').value.trim(),
        estado: 'PENDIENTE' // El administrador tendrá que validarlo después según las reglas de negocio
    };

    if(!payload.nombre || !payload.email || !payload.telefono) {
        alert("Por favor, rellena los campos obligatorios.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/voluntarios`, {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            alert("¡Colaborador registrado! Pendiente de validación por el Administrador.");
            cerrarModalColaborador();
            document.querySelectorAll('#modal-colaborador input').forEach(i => i.value = '');
            if(tiendaSeleccionadaId) {
                // Refrescar el desplegable si había una tienda abierta
                verTurnosTienda(tiendaSeleccionadaId, document.getElementById('nombre-tienda-seleccionada').innerText);
            }
        } else {
            alert("Error al registrar el colaborador.");
        }
    } catch (error) {
        console.error(error);
    }
}

async function eliminarVoluntario(idTurnoBase, idVoluntario) {
    if(!confirm("¿Seguro que quieres quitar a este voluntario del turno?")) return;
    try {
        const res = await fetch(`${API_BASE}/api/logistica/turnos/${idTurnoBase}/voluntarios/${idVoluntario}`, {
            method: 'DELETE'
        });
        if(res.ok) {
            verTurnosTienda(tiendaSeleccionadaId, document.getElementById('nombre-tienda-seleccionada').innerText);
        } else {
            alert("Error al eliminar.");
        }
    } catch (e) {
        console.error(e);
    }
}

function cerrarSesion() { window.location.href = 'index.html'; }