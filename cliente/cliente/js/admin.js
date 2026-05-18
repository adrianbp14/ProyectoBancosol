// Variable global para guardar la lista original descargada del servidor
let listaColaboradoresGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarColaboradores();
});

// 1. DESCARGAMOS LOS DATOS
async function cargarColaboradores() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/colaboradores');
        if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
        
        // Guardamos los datos en la "memoria" (variable global)
        listaColaboradoresGlobal = await respuesta.json();
        
        // Pintamos la tabla completa la primera vez
        pintarTabla(listaColaboradoresGlobal);

    } catch (error) {
        console.error("Error cargando tabla:", error);
    }
}

// 2. LA MAGIA DE PINTAR LA TABLA (Separado para poder reutilizarlo)
function pintarTabla(colaboradoresArray) {
    const tbody = document.querySelector('#tabla-colaboradores tbody');
    tbody.innerHTML = '';

    // Si el filtro no encuentra nada, mostramos un mensaje amigable
    if (colaboradoresArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No se encontraron colaboradores con esos filtros</td></tr>';
        return;
    }

    colaboradoresArray.forEach(colab => {
        const tr = document.createElement('tr');
        
        // Formateo de contactos
        let contactosHTML = '';
        if (colab.contactos && colab.contactos.length > 0) {
            contactosHTML = colab.contactos.map(c => 
                `<div class="contacto-info"><strong>${c.nombreContacto}</strong>: ${c.telefono}</div>`
            ).join('');
        } else {
            contactosHTML = '<em>Sin contactos</em>';
        }

        const claseEstado = colab.estadoValidacion === 'Pendiente' ? 'status-pendiente' : 'status-aprobado';

        // Lógica de botones
        let botonesHTML = '';
        if (colab.estadoValidacion === 'Pendiente') {
            botonesHTML = `
                <button onclick="ejecutarCambioEstado(${colab.idColaborador}, 'Aprobado')" style="background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 4px; width: 100%;">✔ Aprobar</button>
                <br>
                <button onclick="ejecutarCambioEstado(${colab.idColaborador}, 'Rechazado')" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">✖ Rechazar</button>
            `;
        } else {
            botonesHTML = `<span style="color: #6c757d; font-size: 0.9em;">Sin acciones</span>`;
        }

        tr.innerHTML = `
            <td>${colab.idColaborador}</td>
            <td><strong>${colab.nombre}</strong><br><small>${colab.domicilio}</small></td>
            <td>${colab.codigoBancosol || '-'}</td>
            <td>${colab.localidad || '-'}</td>
            <td><span class="status-badge ${claseEstado}">${colab.estadoValidacion}</span></td>
            <td>${contactosHTML}</td>
            <td>${botonesHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. LA FUNCIÓN DEL FILTRO INTERACTIVO
window.aplicarFiltros = function() {
    // Capturamos lo que el usuario ha escrito o seleccionado
    const textoBusqueda = document.getElementById('buscar-nombre').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtro-estado').value;

    // Filtramos nuestra lista global usando JavaScript
    const filtrados = listaColaboradoresGlobal.filter(colab => {
        // ¿El texto está en el nombre o en la localidad?
        const coincideTexto = colab.nombre.toLowerCase().includes(textoBusqueda) || 
                              (colab.localidad && colab.localidad.toLowerCase().includes(textoBusqueda));
        
        // ¿El estado coincide con el desplegable?
        const coincideEstado = (estadoFiltro === "Todos") || (colab.estadoValidacion === estadoFiltro);

        // Si cumple ambas, se queda en la lista
        return coincideTexto && coincideEstado;
    });

    // Volvemos a pintar la tabla solo con los que han pasado el filtro
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