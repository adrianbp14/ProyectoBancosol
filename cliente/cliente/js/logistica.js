/**
 * Lógica específica para la página de Logística
 */

document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    
    inicializarPagina();

    const selectCampana = document.getElementById('select-campana');
    if (selectCampana) {
        selectCampana.addEventListener('change', (event) => {
            const idCampanaSeleccionada = event.target.value;
            actualizarTablaTiendas(idCampanaSeleccionada); 
        });
    }
});

async function actualizarTablaTiendas(idCampana = null) {
    const tbody = document.getElementById('tabla-tiendas');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando tiendas...</td></tr>';
    
    try {
        const tiendas = await obtenerTiendasLogistica(idCampana);
        tbody.innerHTML = ''; 

        if (tiendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay tiendas en esta campaña.</td></tr>';
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
                            Coord.
                        </button>
                        <button class="btn-action" style="background-color: #f39c12; margin-left: 5px;" onclick="abrirModalCapitan(${tienda.id_tienda}, '${tienda.resena_nombre}')">
                            Capitán
                        </button>
                        <button class="btn-action" style="background-color: #28a745; margin-left: 5px;" onclick="abrirModalVoluntario(${tienda.id_tienda}, '${tienda.resena_nombre}')">
                            Voluntarios
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar tiendas:", error);
        tbody.innerHTML = '<tr><td colspan="4" class="error" style="text-align:center;">Error al conectar con el servidor.</td></tr>';
    }
}

async function inicializarPagina() {
    try {
        const campanas = await obtenerCampanas();
        const selectCampana = document.getElementById('select-campana');
        
        if (selectCampana) {
            selectCampana.innerHTML = '<option value="">-- Selecciona una Campaña --</option>';
            campanas.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id_campana; 
                option.textContent = c.nombre; 
                selectCampana.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error cargando campañas:", error);
    }

    await actualizarTablaTiendas(); 

    try {
        // Cargar Coordinadores
        const resCoordinadores = await fetch('http://localhost:8080/api/coordinadores');
        const listaCoordinadores = await resCoordinadores.json();
        const select = document.getElementById('select-coordinador');
        if (select) {
            select.innerHTML = '<option value="">-- Selecciona un Coordinador --</option>';
            listaCoordinadores.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id || c.idCoordinador || c.id_coordinador; 
                option.textContent = `${c.nombre} ${c.apellidos || ''}`; 
                select.appendChild(option);
            });
        }

        // Cargar Capitanes (¡NUEVO!)
        const resCapitanes = await fetch('http://localhost:8080/api/capitanes');
        const listaCapitanes = await resCapitanes.json();
        const selectCapitan = document.getElementById('select-capitan');
        if (selectCapitan) {
            selectCapitan.innerHTML = '<option value="">-- Selecciona un Capitán --</option>';
            listaCapitanes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id_capitan || c.id || c.idCapitan; 
                option.textContent = `${c.nombre} ${c.apellidos || ''}`; 
                selectCapitan.appendChild(option);
            });
        }

        // Cargar Voluntarios
        const voluntarios = await obtenerListaVoluntarios();
        const selectVoluntarios = document.getElementById('select-voluntario');
        const listaVoluntarios = Array.isArray(voluntarios) ? voluntarios : (voluntarios.content || []);
        if (selectVoluntarios) {
            selectVoluntarios.innerHTML = ''; 
            listaVoluntarios.forEach(v => {
                const option = document.createElement('option');
                option.value = v.id_voluntario;
                option.textContent = `${v.nombre} ${v.apellidos || ''}`;
                selectVoluntarios.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar selects:", error);
    }
}

// --- MODAL COORDINADOR ---
function abrirModal(id, nombre) {
    document.getElementById('id-tienda-modal').value = id;
    document.getElementById('nombre-tienda-modal').innerText = nombre;
    document.getElementById('modal-gestion').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal-gestion').style.display = 'none';
}

document.getElementById('btn-confirmar-asignacion').onclick = async () => {
    const idTienda = document.getElementById('id-tienda-modal').value;
    const idCoord = document.getElementById('select-coordinador').value;
    const idCampana = document.getElementById('select-campana').value;
    
    if(!idCampana) { alert("Por favor, selecciona una campaña antes de asignar."); return; }
    if(!idCoord) { alert("Por favor, selecciona un coordinador."); return; }

    try {
        await asignarCoordinadorTienda(idTienda, idCoord, idCampana);
        alert("¡Coordinador asignado con éxito!");
        cerrarModal();
        inicializarPagina(); 
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- MODAL CAPITÁN (¡NUEVO!) ---
function abrirModalCapitan(id, nombre) {
    document.getElementById('id-tienda-capitan').value = id;
    document.getElementById('nombre-tienda-capitan').innerText = nombre;
    document.getElementById('select-capitan').selectedIndex = 0;
    document.getElementById('modal-capitan').style.display = 'block';
}

function cerrarModalCapitan() {
    document.getElementById('modal-capitan').style.display = 'none';
}

document.getElementById('btn-confirmar-capitan').onclick = async () => {
    const idTienda = document.getElementById('id-tienda-capitan').value;
    const idCapitan = document.getElementById('select-capitan').value;
    
    if(!idCapitan) {
        alert("Por favor, selecciona un capitán.");
        return;
    }

    try {
        await asignarCapitanTienda(idTienda, idCapitan);
        alert("¡Capitán asignado con éxito!");
        cerrarModalCapitan();
        inicializarPagina();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- MODAL VOLUNTARIOS ---
function abrirModalVoluntario(id, nombre) {
    document.getElementById('id-tienda-voluntario').value = id;
    document.getElementById('nombre-tienda-voluntario').innerText = nombre;
    document.getElementById('select-voluntario').selectedIndex = -1;
    document.getElementById('modal-voluntario').style.display = 'block';
}

function cerrarModalVoluntario() {
    document.getElementById('modal-voluntario').style.display = 'none';
}

document.getElementById('btn-confirmar-voluntario').onclick = async () => {
    const idTienda = document.getElementById('id-tienda-voluntario').value;
    const selectOptions = document.getElementById('select-voluntario').selectedOptions;
    const voluntariosSeleccionados = Array.from(selectOptions).map(opt => opt.value);
    const idCampana = 1; 

    if(voluntariosSeleccionados.length === 0) {
        alert("Por favor, selecciona al menos un voluntario.");
        return;
    }

    try {
        for (let idVol of voluntariosSeleccionados) {
            await asignarVoluntarioTienda(idTienda, idVol, idCampana);
        }
        alert(`¡Voluntario(s) asignado(s) con éxito!`);
        cerrarModalVoluntario();
    } catch (error) {
        alert("Error: " + error.message);
    }
};