const user = JSON.parse(sessionStorage.getItem('user'));

// 1. Añadimos 'Administrador' a los roles que este script puede validar
const ROLES_PERMITIDOS = [
    'Administrador',
    'Capitan',
    'Responsable de Entidad',
    'Coordinador',
    'Responsable de Tienda'
];

function inicializarPagina() {
    // Validar acceso (auth-common.js redirigirá a index.html si falla)
    if (!comprobarAcceso(ROLES_PERMITIDOS, user)) {
        return;
    }

    const tituloH1 = document.querySelector('.top-header-modern h1');
    const userNameSpan = document.querySelector('#nombre-usuario');

    const puestoActual = user.puesto;

    if (userNameSpan) {
        userNameSpan.textContent = user.nombre || 'Desconocido';
    }

    if (tituloH1 && puestoActual) {
        // Lógica de títulos según el string exacto que viene de tu base de datos relacional
        switch (puestoActual) {
            case 'Administrador':
                tituloH1.textContent = 'Panel de Control Total: Administrador';
                document.title = 'Admin - Sistema';
                break;
            case 'Capitan':
                tituloH1.textContent = 'Panel de Gestión: Capitán';
                document.title = 'Perfil Capitán';
                break;
            case 'Responsable de Entidad':
                tituloH1.textContent = 'Panel: Responsable de Entidad';
                document.title = 'Perfil Responsable Entidad';
                break;
            case 'Coordinador':
                tituloH1.textContent = 'Panel de Control: Coordinador';
                document.title = 'Perfil Coordinador';
                break;
            case 'Responsable de Tienda':
                tituloH1.textContent = 'Gestión de Tienda: Responsable';
                document.title = 'Perfil Responsable Tienda';
                break;
            default:
                tituloH1.textContent = 'Panel de Usuario';
        }
    }
}

// Cierre de sesión
const btnCerrarSesion = document.querySelector('#btn-cierre-sesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', inicializarPagina);