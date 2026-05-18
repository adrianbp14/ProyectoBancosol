const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const EXPECTED_ROLE = ['Administrador'];

if (!comprobarAcceso(EXPECTED_ROLE, user)) {
  throw new Error('Acceso denegado');
}

document.querySelector('#nombre-usuario').textContent = 'Usuario: ' + (user.nombre || 'desconocido');
document.querySelector('#btn-cierre-sesion').addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = 'index.html';
});

function rellenarTablaUsuarios(usuarios) {
  const tabla = document.querySelector('#tabla-usuarios');

  // Eliminar filas anteriores antes de agregar nuevas 
  // (para evitar duplicados en caso de recarga o múltiples llamadas)  
  const cuerpoTabla = tabla.querySelector('tbody');
  while (cuerpoTabla.firstChild) {
    cuerpoTabla.removeChild(cuerpoTabla.firstChild);
  }

  if (usuarios.length === 0) {
    tabla.innerHTML = '<tr><td colspan="3">No se cargaron usuarios.</td></tr>';
    return;
  }
  usuarios.forEach(usuario => {
    const tr = document.createElement('tr');
    const tdNombre = document.createElement('td');
    const tdEmail = document.createElement('td');
    const tdPuesto = document.createElement('td');
    const tdModificar = document.createElement('td');
    const tdId = document.createElement('td');
    tdId.style.display = 'none'; // Ocultar columna de ID (opcional)

    tdNombre.textContent = usuario.nombre;
    tdEmail.textContent = usuario.email;
    tdPuesto.textContent = usuario.puesto || 'desconocido'; // Si no hay puesto, mostrar 'desconocido' en la tabla en lugar de 'desconocido' en el texto del usuario 
    tdId.textContent = usuario.id; // Agregar columna de ID para referencia (opcional)
    tr.appendChild(tdNombre);
    tr.appendChild(tdEmail);
    tr.appendChild(tdPuesto);
    tr.appendChild(tdModificar);
    const btnModificar = document.createElement('button');
    btnModificar.textContent = 'Modificar';
    tdModificar.appendChild(btnModificar);
    tr.appendChild(tdId);

    // Aquí podríamos agregar un event listener al botón de modificar para realizar alguna acción, como abrir un modal o redirigir a otra página.
    btnModificar.addEventListener('click',
      mostrarModalModificarUsuario
    );

    // Alternativamente, podríamos usar innerHTML para construir la fila de la tabla:
    //    tr.innerHTML = `
    //   <td>${usuario.nombre}</td>
    //    <td>${usuario.email}</td>
    //    <td>${usuario.puesto || 'desconocido'}</td>
    // `;
    tabla.querySelector('tbody').appendChild(tr);
  });
}

// Ejemplo de ventana modal para modificar usuario 
// (puede ser mejorado con estilos y validaciones)
function mostrarModalModificarUsuario(e) {
  const idUsuario =       // id del usuario como número entero
    parseInt(e.target.    // botón clickeado
      parentElement.      // <td> que contiene el botón
      nextElementSibling. // <td> que contiene el ID oculto
      innerText);         // id del usuario como texto

  // El primer usuario que coincida con el ID (debería ser solo uno)
  const usuarioMod = usuariosCargados.filter(u => u.id === idUsuario)[0];

  const modal = document.querySelector('#ventanaModal');

  // Mostrar el modal
  modal.style.display = 'block';

  // Cerrar el modal al hacer clic en la 'x'
  modal.querySelector('.cerrar').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar el modal al pulsar el botón de cancelar
  modal.querySelector('#modalCancelar').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Rellenar el formulario del modal con los datos del usuario
  modal.querySelector('#nombre').value = usuarioMod.nombre;
  modal.querySelector('#email').value = usuarioMod.email;
  modal.querySelector('#puesto').value = usuarioMod.puesto || 'desconocido';

  modal.querySelector('#modalGuardar').addEventListener('click', () => {
    // Petición PUT a API_ENDPOINT + '/' + usuarioMod.id con 
    // los nuevos datos del usuario
    const datosActualizados = {
      nombre: modal.querySelector('#nombre').value,
      email: modal.querySelector('#email').value,
      puesto: modal.querySelector('#puesto').value || 'desconocido',
      id: idUsuario // Asegurarse de incluir el ID del usuario para la actualización
    };

    try {
      const usuAct = putUsuarioActualizado(datosActualizados);
      usuAct.then(() => {  // funcion asíncrona, devuelve una promesa
      // Actualizar la tabla con los nuevos datos (sin recargar la página)
        usuarioMod.nombre = datosActualizados.nombre;
        usuarioMod.email = datosActualizados.email;
        usuarioMod.puesto = datosActualizados.puesto;
        rellenarTablaUsuarios(usuariosCargados);
      }).catch(err => {
        console.error('Error en la petición de actualización:', err);
        alert('Error en la petición de actualización al servidor.');
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Error al actualizar el usuario. Por favor, inténtelo de nuevo.');
    }
    // Ocultar ventana modal
    modal.style.display = 'none';
  });
}


let usuariosCargados = [];
try {
  cargarUsuarios().then(usuarios => {  // funcion asíncrona, devuelve una promesa
    usuariosCargados = usuarios;
    rellenarTablaUsuarios(usuariosCargados);
  }).catch(err => {
    console.error('Error en la petición:', err);
    const tabla = document.querySelector('#tabla-usuarios');
    tabla.innerHTML = '<tr><td colspan="3">Error en la petición de usuarios al servidor.</td></tr>';
  })
} catch (err) {
  console.error('Error al cargar los usuarios:', err);
  const tabla = document.querySelector('#tabla-usuarios');
  tabla.innerHTML = '<tr><td colspan="3">Error al cargar los usuarios.</td></tr>';

};