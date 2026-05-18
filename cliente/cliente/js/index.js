const PAGINAS_POR_PUESTO = {
  'Administrador': 'admin.html',
  'Coordinador': 'coordinadorIndex.html',
  'Capitan': 'capi-respEnt.html',
  'Responsable de Entidad': 'capi-respEnt.html',
  'Responsable de Tienda': 'respTienda.html'
};

// --- Lógica de Mostrar/Ocultar Contraseña ---
const passwordInput = document.querySelector('#password');
const togglePasswordButton = document.querySelector('#toggle-password');

if (togglePasswordButton) {
  togglePasswordButton.addEventListener('click', () => {
    // Alternar entre tipo password y text
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

    // Cambiar el icono/emoji
    togglePasswordButton.textContent = isPassword ? '🙈' : '👁️';
  });
}

// --- Lógica de Inicio de Sesión ---
document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombreUsuario = document.querySelector('#username').value.trim();
  const contrasena = document.querySelector('#password').value;
  const message = document.querySelector('#message');

  // Limpiar clases previas y mostrar estado
  message.textContent = 'Iniciando sesión...';
  message.className = '';

  try {
    // Usamos await para manejar la promesa de forma más limpia
    const datosInicioSesion = await iniciarSesion(nombreUsuario, contrasena);

    if (datosInicioSesion.token && datosInicioSesion.user && datosInicioSesion.user.puesto) {

      // Guardar datos en sessionStorage
      sessionStorage.setItem('token', datosInicioSesion.token);
      sessionStorage.setItem('user', JSON.stringify(datosInicioSesion.user));

      let rolAsignar = datosInicioSesion.user.puesto.toUpperCase();
      if (rolAsignar.includes('ADMIN')) {
          rolAsignar = 'ADMIN';
      }
      sessionStorage.setItem('rol', rolAsignar);

    
      let idCoord = datosInicioSesion.user.idCoordinador || datosInicioSesion.user.id || datosInicioSesion.user.id_usuario || 0;
      sessionStorage.setItem('id_coordinador', idCoord);

      const targetPage = PAGINAS_POR_PUESTO[datosInicioSesion.user.puesto];

      if (!targetPage) {
        message.textContent = 'Error: puesto no reconocido.';
        message.className = 'error';
        return;
      }

      message.textContent = 'Inicio de sesión correcto. Redirigiendo...';
      message.className = 'success';

      // Pequeña pausa para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        window.location.href = targetPage;
      }, 500);

    } else {
      message.textContent = 'Error: Credenciales inválidas o datos incompletos.';
      message.className = 'error';
    }

  } catch (err) {
    message.textContent = 'Error en el inicio de sesión: ' + err.message;
    message.className = 'error';
    console.error('Error detallado:', err);
  }
});