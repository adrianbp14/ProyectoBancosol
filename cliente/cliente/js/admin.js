// Variable global para guardar la lista original descargada del servidor
let listaColaboradoresGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarColaboradores();
});

// 1. DESCARGAMOS LOS DATOS
// 1. DESCARGAMOS LOS DATOS (¡Ahora con seguridad!)
async function cargarColaboradores() {
    try {
        // Recuperamos el token de la memoria del navegador
        const token = sessionStorage.getItem('token');

        // Hacemos la petición añadiendo el "pase VIP" en las cabeceras
        const respuesta = await fetch('http://localhost:8080/api/colaboradores', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor: ' + respuesta.status);
        }
        
        // Guardamos los datos en la "memoria" (variable global)
        listaColaboradoresGlobal = await respuesta.json();
        
        // Pintamos la tabla completa la primera vez
        pintarTabla(listaColaboradoresGlobal);

    } catch (error) {
        console.error("Error cargando tabla:", error);
        // Opcional: Mostrar un mensajito en la tabla si falla la conexión
        const tbody = document.querySelector('#tabla-colaboradores tbody');
        if(tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error de conexión. Revisa la consola.</td></tr>`;
    }
}

function pintarTabla(colaboradoresArray) {
    const tbody = document.querySelector('#tabla-colaboradores tbody');
    tbody.innerHTML = '';

    const idRol = sessionStorage.getItem('rol');

    if (colaboradoresArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No se encontraron colaboradores con esos filtros</td></tr>';
        return;
    }

    colaboradoresArray.forEach(colab => {
        const tr = document.createElement('tr');
        
        // Formateo de contactos (Aseguramos que lee nombre_contacto)
        let contactosHTML = '';

        if (colab.contactos && colab.contactos.length > 0) {
            contactosHTML = colab.contactos.map(c => 
                `<div class="contacto-info"><strong>${c.nombre_contacto || c.nombreContacto}</strong>: ${c.telefono}</div>`
            ).join('');
        } else {
            contactosHTML = '<em>Sin contactos</em>';
        }

        const id = colab.id_colaborador;
        const estado = colab.estado_validacion || 'Pendiente';
        const codigo = colab.codigo_bancosol || '-';
        // Extraemos el nombre de la localidad si existe
        const nombreLocalidad = (colab.localidad && colab.localidad.nombre) ? colab.localidad.nombre : '-';

        let claseEstado = '';
        if (estado === 'Pendiente') {
            claseEstado = 'status-pendiente';
        } else if (estado === 'Rechazado') {
            claseEstado = 'status-rechazado';
        } else {
            claseEstado = 'status-aprobado';
        }

        // Lógica de botones (Ahora el ID sí existe, así que api.js funcionará)
        let botonesHTML = '';
        if (estado === 'Pendiente') {
            // Comprobamos si el ID del rol es 1 (Administrador)
            if (idRol === "ADMIN") { 
                botonesHTML = `
                    <button onclick="ejecutarCambioEstado(${id}, 'Aprobado')" 
                    style="background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 4px; width: 100%;">✔ Aprobar</button>
                    <br>
                    <button onclick="ejecutarCambioEstado(${id}, 'Rechazado')" 
                    style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">✖ Rechazar</button>
                `;
            } else {
                // Si el ID es cualquier otro (2, 3...), solo ve el texto
                botonesHTML = `<span style="color: #856404; font-size: 0.9em;">Pendiente de Admin</span>`;
            }
        } else {
            botonesHTML = `<span style="color: #6c757d; font-size: 0.9em;">Sin acciones</span>`;
        }

        tr.innerHTML = `
            <td>${id}</td>
            <td><strong>${colab.nombre}</strong><br><small>${colab.domicilio || ''}</small></td>
            <td>${codigo}</td>
            <td>${nombreLocalidad}</td>
            <td><span class="status-badge ${claseEstado}">${estado}</span></td>
            <td>${contactosHTML}</td>
            <td>${botonesHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. LA FUNCIÓN DEL FILTRO INTERACTIVO
window.aplicarFiltros = function() {
    const textoBusqueda = document.getElementById('buscar-nombre').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtro-estado').value;

    const filtrados = listaColaboradoresGlobal.filter(colab => {
        // Extraemos el nombre de la localidad de forma segura para buscar
        const locNombre = (colab.localidad && colab.localidad.nombre) ? colab.localidad.nombre.toLowerCase() : '';
        
        // ¿El texto está en el nombre de la entidad o en la localidad?
        const coincideTexto = colab.nombre.toLowerCase().includes(textoBusqueda) || locNombre.includes(textoBusqueda);
        
        // ¿El estado coincide con el desplegable? (Usamos estado_validacion)
        const coincideEstado = (estadoFiltro === "Todos") || (colab.estado_validacion === estadoFiltro);

        return coincideTexto && coincideEstado;
    });

    pintarTabla(filtrados);
}

// 4. EL BOTÓN DE ACCIÓN (El que ya tenías)
window.ejecutarCambioEstado = async function(id, nuevoEstado) {
    if(!confirm(`¿Estás seguro de que quieres marcar a este colaborador como ${nuevoEstado}?`)) {
        return;
    }

    try {
        await apiCambiarEstadoColaborador(id, nuevoEstado);
        alert(`¡Colaborador ${nuevoEstado.toLowerCase()} con éxito!`);
        cargarColaboradores(); // Recarga los datos del servidor para estar 100% sincronizados
    } catch (error) {
        alert("Hubo un error al actualizar el estado. Revisa la consola.");
        console.error(error);
    }
}

// Detectar si el usuario pulsa Enter en la barra de búsqueda
window.comprobarEnter = function(evento) {
    if (evento.key === "Enter") {
        aplicarFiltros();
    }
}