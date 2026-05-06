function comprobarAcceso(puestosEsperados, datosUsuario) {
  const token = sessionStorage.getItem('token');

  if (!token || !datosUsuario || !datosUsuario.puesto) {
    window.location.href = 'index.html';
    return false;
  }

  if (!Array.isArray(puestosEsperados) || puestosEsperados.length === 0) {
    window.location.href = 'index.html';
    return false;
  }

  if (!puestosEsperados.includes(datosUsuario.puesto)) {
    window.location.href = 'index.html';
    return false;
  }

  return true;
}