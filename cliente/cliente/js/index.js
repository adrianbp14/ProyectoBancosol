const PAGINAS_POR_PUESTO = {
  'Administrador': 'admin.html',
  'Coordinador': 'coordinador.html',
  'Capitan': 'capitan.html',
  'Responsable de Entidad': 'responsable-entidad.html',
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

      // CAPTURA DIRECTA: Obtenemos el id_usuario que acabamos de inyectar en el mapa
      // 1. Extraemos el id_usuario real de la base de datos que viene en el JSON
      let idLogueado = datosInicioSesion.user.id_usuario || 0;

      // 2. Lo guardamos como 'id_coordinador' para no romper las pantallas de tus compañeros
      sessionStorage.setItem('id_coordinador', idLogueado);

      // 3. Lo guardamos como 'id_usuario' para que lo use tu nueva pantalla de capitán
      sessionStorage.setItem('id_usuario', idLogueado);

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