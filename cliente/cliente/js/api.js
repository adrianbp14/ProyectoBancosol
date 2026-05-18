// ==========================================
// CONFIGURACIÓN DE RUTAS BASE
// ==========================================
const API_BASE = 'http://localhost:8080'; 

const API_AUTH = `${API_BASE}/auth`;             // Autenticación y usuarios
const API_TIENDAS = `${API_BASE}/api/tiendas`;     // Tiendas para el mapa
const API_LOGISTICA = `${API_BASE}/api/logistica/tiendas`; // Logística
const API_COLABORADORES = `${API_BASE}/api/colaboradores`; // Colaboradores
const API_VOLUNTARIOS = `${API_BASE}/api/voluntarios`; // Ruta para tu tabla 'voluntario'
const API_CAMPANAS = `${API_BASE}/api/campanas`; // Ruta campañas
const API_COORDINADORES = `${API_BASE}/api/coordinadores`;
const API_CAPITANES = `${API_BASE}/api/capitanes`;
const API_LOCALIDADES = `${API_BASE}/api/localidades`;
const API_DISTRITOS = `${API_BASE}/api/distritos`;

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

// En api.js - Reemplaza tu función actual por esta:
async function obtenerTiendasLogistica(idCampana = null) {
  const token = sessionStorage.getItem('token');
  let url = API_LOGISTICA;

  if (idCampana) {
    url += `?campanaId=${idCampana}`;
  }

  const respuesta = await fetch(url, { 
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

// ==========================================
// 🙋‍♂️ GESTIÓN DE VOLUNTARIOS EN LOGÍSTICA
// ==========================================

// Obtener lista de voluntarios (CORREGIDO: Ahora usa API_VOLUNTARIOS)
async function obtenerListaVoluntarios() {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(API_VOLUNTARIOS, { // ¡Cambio importante aquí!
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });

    if (respuesta.ok) {
        return await respuesta.json();
    } else {
        throw new Error("Fallo en la carga de voluntarios");
    }
}

// Asignar voluntario (Endpoint asumido, debes asegurarte de que exista en tu Spring Boot)
async function asignarVoluntarioTienda(idTienda, idVoluntario, idCampana) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_BASE}/api/logistica/asignar-voluntario`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idTienda: parseInt(idTienda),
            idVoluntario: parseInt(idVoluntario),
            idCampana: parseInt(idCampana)
        })
    });

    if (respuesta.ok) {
        return await respuesta.text(); // A veces estos endpoints devuelven texto y no JSON
    } else {
        const mensajeError = await respuesta.text();
        throw new Error(mensajeError);
    }
}


async function obtenerCampanas() {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(API_CAMPANAS, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });

    if (respuesta.ok) {
        return await respuesta.json();
    } else {
        throw new Error(`Error al obtener campañas: ${respuesta.status}`);
    }
}


// ==========================================================
// MANTENIMIENTO DE PERSONAL LOGÍSTICO (COORDINADORES/CAPITANES)
// ==========================================================

// --- UBICACIONES (LOCALIDADES Y DISTRITOS) ---
async function obtenerLocalidades() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_LOCALIDADES, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) return [];
    return await res.json();
}

async function obtenerDistritos() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_DISTRITOS, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) return [];
    return await res.json();
}

// --- COORDINADORES ---
async function obtenerCoordinadores() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_COORDINADORES, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) return [];
    return await res.json();
}

async function crearCoordinadorAPI(payload) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_COORDINADORES, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

async function actualizarCoordinadorAPI(id, payload) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_COORDINADORES}/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

async function borrarCoordinadorAPI(id) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_COORDINADORES}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al borrar coordinador");
}

// --- CAPITANES ---
async function obtenerCapitanes() {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_CAPITANES, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) return [];
    return await res.json();
}

async function crearCapitanAPI(payload) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(API_CAPITANES, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

async function actualizarCapitanAPI(id, payload) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_CAPITANES}/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

async function borrarCapitanAPI(id) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_CAPITANES}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al borrar capitán");
}