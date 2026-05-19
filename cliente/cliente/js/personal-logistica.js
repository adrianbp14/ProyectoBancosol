// ==========================================
// LÓGICA DE PERSONAL DE LOGÍSTICA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    cargarPersonalLogistico();
    cargarLocalidadesYDistritos();

    document.getElementById('filtro-rol').addEventListener('change', (event) => {
        cargarPersonalLogistico(event.target.value);
    });

    document.getElementById('btn-guardar-personal').addEventListener('click', guardarPersonal);
});

async function cargarPersonalLogistico(filtro = 'todos') {
    const tbody = document.getElementById('tabla-personal');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando datos...</td></tr>';

    let coordinadores = [];
    let capitanes = [];

    try {
        coordinadores = await obtenerCoordinadores();
        coordinadores = coordinadores.map(c => ({ ...c, tipo_rol: 'Coordinador' }));
    } catch (e) {
        console.warn("Aviso: No se pudieron cargar los coordinadores", e);
    }

    try {
        capitanes = await obtenerCapitanes();
        capitanes = capitanes.map(c => ({ ...c, tipo_rol: 'Capitán' }));
    } catch (e) {
        console.warn("Aviso: No se pudieron cargar los capitanes (probablemente falte el Backend)", e);
    }

    let personal = [];
    if (filtro === 'coordinadores') personal = coordinadores;
    else if (filtro === 'capitanes') personal = capitanes;
    else personal = [...coordinadores, ...capitanes];

    tbody.innerHTML = '';

    if (personal.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay personal registrado en el servidor.</td></tr>';
        return;
    }

    personal.forEach(p => {
        const nombreCompleto = p.tipo_rol === 'Coordinador' ? `${p.nombre} ${p.apellidos || ''}` : p.nombre;
        const entidad = p.entidad_pertenencia || p.entidadPertenencia || 'N/A'; 
        const area = p.distrito ? p.distrito.nombre : (p.localidad ? p.localidad.nombre : 'No definida');
        
        // Buscamos el ID en todos los formatos posibles para que nunca sea undefined
        const idPersona = p.id_coordinador || p.idCoordinador || p.id_capitan || p.idCapitan || p.id;
        
        tbody.innerHTML += `
            <tr>
                <td>${nombreCompleto}</td>
                <td><strong>${p.tipo_rol}</strong></td>
                <td>${entidad}</td>
                <td>${p.telefono || 'Sin tfno'} / ${area}</td>
                <td>${p.email || 'Sin email'}</td>
                <td>
                    <button class="btn-action" style="background-color: #f39c12;" onclick="editarPersonal(${idPersona}, '${p.tipo_rol}')">✏️ Editar</button>
                    <button class="btn-action" style="background-color: #e74c3c; margin-left: 5px;" onclick="eliminarPersonal(${idPersona}, '${p.tipo_rol}')">🗑️ Borrar</button>
                </td>
            </tr>
        `;
    });
}

async function cargarLocalidadesYDistritos() {
    try {
        const localidades = await obtenerLocalidades();
        const distritos = await obtenerDistritos();

        const selectLoc = document.getElementById('select-localidad');
        const selectDis = document.getElementById('select-distrito');

        localidades.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id_localidad;
            opt.textContent = l.nombre;
            selectLoc.appendChild(opt);
        });

        distritos.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id_distrito;
            opt.textContent = d.nombre;
            selectDis.appendChild(opt);
        });
    } catch (error) {
        console.error("Error cargando ubicaciones:", error);
    }
}

async function guardarPersonal() {
    const tipo = document.getElementById('tipo-personal').value; 
    const id = document.getElementById('id-personal-modal').value; 
    
    const nombre = document.getElementById('input-nombre').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const idLocalidad = document.getElementById('select-localidad').value;

    if (!nombre) {
        alert("⚠️ Por favor, introduce un nombre.");
        return; 
    }
    if (!email) {
        alert("⚠️ Por favor, introduce un correo electrónico.");
        return;
    }
    if (!idLocalidad) {
        alert("⚠️ Por favor, selecciona una localidad.");
        return;
    }
    // ------------------------------------------------

    const payload = {
        nombre: nombre,
        telefono: document.getElementById('input-telefono').value,
        email: email,
        id_localidad: idLocalidad
    };

    if (tipo === 'coordinador') {
        payload.apellidos = document.getElementById('input-apellidos').value;
        payload.entidad_pertenencia = document.getElementById('input-entidad').value;
        payload.id_distrito = document.getElementById('select-distrito').value || null;
    }

    try {
        if (id) {
            if (tipo === 'coordinador') await actualizarCoordinadorAPI(id, payload);
            else await actualizarCapitanAPI(id, payload);
            alert("¡Actualizado con éxito!");
        } else {
            if (tipo === 'coordinador') await crearCoordinadorAPI(payload);
            else await crearCapitanAPI(payload);
            alert("¡Personal registrado con éxito!");
        }
        
        cerrarModalPersonal(); 
        cargarPersonalLogistico(); 
    } catch (error) {
        alert("Error al guardar: " + error.message);
        console.error(error);
    }
}

async function eliminarPersonal(id, tipoRol) {
    if (confirm(`¿Estás seguro de que deseas eliminar este ${tipoRol}?`)) {
        try {
            if (tipoRol === 'Coordinador') {
                await borrarCoordinadorAPI(id);
            } else {
                await borrarCapitanAPI(id);
            }
            alert("Eliminado correctamente.");
            cargarPersonalLogistico();
        } catch (error) {
            alert("Error al eliminar. Puede que tenga tiendas asignadas.");
        }
    }
}

// ==========================================
// EDICIÓN DE PERSONAL
// ==========================================
async function editarPersonal(id, tipo) {
    document.getElementById('titulo-modal').innerText = `Editar ${tipo}`;
    document.getElementById('id-personal-modal').value = id; 
    
    const selectTipo = document.getElementById('tipo-personal');
    selectTipo.value = tipo.toLowerCase();
    selectTipo.disabled = true; 
    
    toggleCamposEspecíficos();

    try {
        let lista = tipo === 'Coordinador' ? await obtenerCoordinadores() : await obtenerCapitanes();
        let persona = lista.find(p => (p.id_coordinador == id || p.idCoordinador == id || p.id_capitan == id || p.idCapitan == id || p.id == id));
        if (persona) {
            document.getElementById('input-nombre').value = persona.nombre || '';
            document.getElementById('input-telefono').value = persona.telefono || '';
            document.getElementById('input-email').value = persona.email || '';
            
            if (persona.localidad) {
                document.getElementById('select-localidad').value = persona.localidad.idLocalidad || persona.localidad.id_localidad || '';
            }

            if (tipo === 'Coordinador') {
                document.getElementById('input-apellidos').value = persona.apellidos || '';
                document.getElementById('input-entidad').value = persona.entidadPertenencia || persona.entidad_pertenencia || '';
                if (persona.distrito) {
                    document.getElementById('select-distrito').value = persona.distrito.idDistrito || persona.distrito.id_distrito || '';
                }
            }

            document.getElementById('modal-personal').style.display = 'block';
        }
    } catch (error) {
        console.error("Error al cargar datos para editar:", error);
        alert("No se pudieron cargar los datos de esta persona.");
    }
}


function abrirModalCrear() {
    document.getElementById('titulo-modal').innerText = 'Añadir Personal Logístico';
    document.getElementById('id-personal-modal').value = '';
    document.querySelectorAll('#modal-personal input').forEach(i => i.value = '');
    document.getElementById('tipo-personal').disabled = false; 
    toggleCamposEspecíficos();
    document.getElementById('modal-personal').style.display = 'block';
}

function cerrarModalPersonal() {
    document.getElementById('modal-personal').style.display = 'none';
}

function toggleCamposEspecíficos() {
    const tipo = document.getElementById('tipo-personal').value;
    const displayCoord = tipo === 'coordinador' ? 'block' : 'none';
    document.getElementById('campos-coordinador').style.display = displayCoord;
    document.getElementById('grupo-apellidos').style.display = displayCoord;
    document.getElementById('grupo-distrito').style.display = displayCoord;
}

