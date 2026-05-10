// ==========================================
// CONFIGURACIÓN DE RUTAS BASE
// ==========================================
const API_BASE = 'http://localhost:8080'; 

const API_AUTH = `${API_BASE}/auth`;             // Autenticación y usuarios
const API_TIENDAS = `${API_BASE}/api/tiendas`;     // Tiendas para el mapa
const API_LOGISTICA = `${API_BASE}/api/logistica/tiendas`; // Logística
const API_COLABORADORES = `${API_BASE}/api/colaboradores`; // Colaboradores

// ==========================================
// 🔐 AUTENTICACIÓN Y USUARIOS
// ==========================================

async function iniciarSesion(username, password) {
  console.log('Intentando iniciar sesión con:', username);

  const respuestaInicioSesion = await fetch(API_AUTH + "/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }) 
  });

  if (respuestaInicioSesion.ok) {
    return await respuestaInicioSesion.json();
  } else {
    const errorText = await respuestaInicioSesion.text();
    throw new Error(errorText || `Error ${respuestaInicioSesion.status}`);
  }
}

async function cargarUsuarios() {
  const token = sessionStorage.getItem('token');
  
  // Llamamos exactamente a http://localhost:8080/auth/users
  const respuesta = await fetch(`${API_AUTH}/users`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });

  if (respuesta.ok) {
    return await respuesta.json(); // Retorna la lista directamente[cite: 8]
  } else {
    throw new Error("Fallo en la carga de usuarios");
  }
}

async function putUsuarioActualizado(datosActualizados) {
  const LOCAL_ROUTE = "/users";
  const response = await fetch(`${API_BASE}${LOCAL_ROUTE}/${datosActualizados.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    body: JSON.stringify(datosActualizados)
  });

  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      return result.usuario; 
    } else {
      throw new Error('Error en la actualización del usuario: ' + result.message);
    }
  } else {
    throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
  }
}

// ==========================================
// 🏢 COLABORADORES
// ==========================================

/**
 * Envía los datos de un nuevo colaborador al servidor (Spring Boot)
 * @param {Object} payload - Objeto JSON con los datos del colaborador
 * @returns {Promise<Object>} La respuesta del servidor
 */
async function apiCrearColaborador(payload) {
    const token = sessionStorage.getItem('token') || '';

    try {
        const respuesta = await fetch(API_COLABORADORES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        return await respuesta.json(); 
        
    } catch (error) {
        console.error("Fallo en la comunicación con la API (apiCrearColaborador):", error);
        throw error; 
    }
}

/**
 * Cambia el estado de un colaborador (Ej: de Pendiente a Aprobado)
 */
async function apiCambiarEstadoColaborador(id, nuevoEstado) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_COLABORADORES}/${id}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        // Enviamos el nuevo estado en formato JSON
        body: JSON.stringify({ estado: nuevoEstado }) 
    });

    if (!respuesta.ok) {
        throw new Error("Error al cambiar el estado del colaborador");
    }
    return await respuesta.json();
}

// ==========================================
// 🗺️ TIENDAS Y LOGÍSTICA
// ==========================================

async function obtenerTiendas() {
  const token = sessionStorage.getItem('token');
  const respuesta = await fetch(API_TIENDAS, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });

  if (respuesta.ok) {
    return await respuesta.json(); 
  } else {
    if (respuesta.status === 401 || respuesta.status === 403) {
      window.location.href = 'index.html';
    }
    const errorText = await respuesta.text();
    throw new Error(errorText || `Error al obtener tiendas: ${respuesta.status}`);
  }
}

async function obtenerTiendasLogistica() {
  const token = sessionStorage.getItem('token');
  const respuesta = await fetch(API_LOGISTICA, { 
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });

  if (respuesta.ok) {
    return await respuesta.json();
  } else {
    if (respuesta.status === 401 || respuesta.status === 403) {
      window.location.href = 'index.html';
    }
    throw new Error(`Error al obtener tiendas de logística: ${respuesta.status}`);
  }
}

async function asignarCoordinadorTienda(idTienda, idCoordinador, idCampana) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_BASE}/api/logistica/asignar`, { 
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idTienda: parseInt(idTienda),
            idCoordinador: parseInt(idCoordinador),
            idCampana: parseInt(idCampana)
        })
    });

    if (respuesta.ok) {
        return await respuesta.json();
    } else {
        const mensajeError = await respuesta.text(); 
        throw new Error(mensajeError); 
    }
}