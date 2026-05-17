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

    const selectCampana = document.getElementById('select-campana');
    if (selectCampana) {
        selectCampana.addEventListener('change', (event) => {
            const idCampanaSeleccionada = event.target.value;
            actualizarTablaTiendas(idCampanaSeleccionada); 
        });
    }

});

// Recarga la tabla de tiendas según la campaña
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
                        <button class="btn-action" style="background-color: #28a745; margin-left: 5px;" onclick="abrirModalVoluntario(${tienda.id_tienda}, '${tienda.resena_nombre}')">
                            Voluntarios
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar tiendas filtradas:", error);
        tbody.innerHTML = '<tr><td colspan="4" class="error" style="text-align:center;">Error al conectar con el servidor.</td></tr>';
    }
}

// 1. Cargar datos base al abrir la página
async function inicializarPagina() {
    // 1. CARGA DINÁMICA DE CAMPAÑAS (Nuevo bloque)
    try {
        const campanas = await obtenerCampanas();
        const selectCampana = document.getElementById('select-campana');
        
        if (selectCampana) {
            selectCampana.innerHTML = '<option value="">-- Selecciona una Campaña --</option>';
            
            campanas.forEach(c => {
                const option = document.createElement('option');
                // Usamos id_campana y nombre según tu esquema de base de datos
                option.value = c.id_campana; 
                option.textContent = c.nombre; 
                selectCampana.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar las campañas dinámicas:", error);
        const selectCampana = document.getElementById('select-campana');
        if (selectCampana) {
            selectCampana.innerHTML = '<option value="">-- Error al cargar campañas --</option>';
        }
    }

    // 2. Cargamos las tiendas (sin filtro inicial)
    await actualizarTablaTiendas(); 

    // 3. Cargamos los coordinadores y voluntarios para las modales
    try {
        // -- NUEVO: Llamamos a tu endpoint de coordinadores --
        const resCoordinadores = await fetch('http://localhost:8080/api/coordinadores');
        const listaCoordinadores = await resCoordinadores.json();
        
        // -- VOLUNTARIOS (Se queda igual que lo tenías) --
        try {
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
            console.error("Error al cargar voluntarios:", error);
        }
        
        // -- COORDINADORES: Rellenamos el desplegable --
        const select = document.getElementById('select-coordinador');
        if (select) {
            select.innerHTML = '<option value="">-- Selecciona un Coordinador --</option>';
            
            listaCoordinadores.forEach(c => {
                console.log("Coordinador recibido de Java:", c);
                const option = document.createElement('option');
                // Buscamos el ID real del coordinador
                option.value = c.id || c.idCoordinador || c.id_coordinador; 
                // Juntamos nombre y apellidos
                option.textContent = `${c.nombre} ${c.apellidos || ''}`; 
                select.appendChild(option);
            });
        }

    } catch (error) {
        console.error("ERROR AL CARGAR COORDINADORES:", error);
        const select = document.getElementById('select-coordinador');
        if (select) {
            select.innerHTML = '<option value="">-- Error: Revisa la consola --</option>';
        }
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
    
    const idCampana = document.getElementById('select-campana').value;
    console.log("Enviando -> Tienda:", idTienda, " | Coordinador:", idCoord, " | Campaña:", idCampana);
    
    if(!idCampana) {
        alert("Por favor, selecciona una campaña antes de asignar.");
        return;
    }

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

// ==========================================
// 4. Control de la Modal de Voluntarios
// ==========================================
function abrirModalVoluntario(id, nombre) {
    document.getElementById('id-tienda-voluntario').value = id;
    document.getElementById('nombre-tienda-voluntario').innerText = nombre;
    // Limpiamos selecciones previas
    document.getElementById('select-voluntario').selectedIndex = -1;
    document.getElementById('modal-voluntario').style.display = 'block';
}

function cerrarModalVoluntario() {
    document.getElementById('modal-voluntario').style.display = 'none';
}

// 5. Confirmar asignación múltiple de voluntarios
document.getElementById('btn-confirmar-voluntario').onclick = async () => {
    const idTienda = document.getElementById('id-tienda-voluntario').value;
    const selectOptions = document.getElementById('select-voluntario').selectedOptions;

    // Convertimos las opciones seleccionadas en un array de IDs
    const voluntariosSeleccionados = Array.from(selectOptions).map(opt => opt.value);

    const idCampana = 1; // Igual que con el coordinador

    if(voluntariosSeleccionados.length === 0) {
        alert("Por favor, selecciona al menos un voluntario.");
        return;
    }

    try {
        // Ejecutamos la promesa de asignación por cada voluntario seleccionado
        for (let idVol of voluntariosSeleccionados) {
            await asignarVoluntarioTienda(idTienda, idVol, idCampana);
        }

        alert(`¡${voluntariosSeleccionados.length} voluntario(s) asignado(s) con éxito!`);
        cerrarModalVoluntario();
    } catch (error) {
        if (error.message.includes("duplicate") || error.message.includes("exists")) {
            alert("⚠️ Algunos de estos voluntarios ya estaban asignados a esta tienda.");
        } else {
            console.error("Error al asignar voluntario:", error);
            alert("Error: " + error.message);
        }
    }
};