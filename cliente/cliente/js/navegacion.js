/**
 * navegacion.js - Gestión dinámica de redirecciones según el rol del usuario
 */
const PAGINAS_POR_PUESTO_GLOBAL = {
    'Administrador': 'admin.html',
    'Coordinador': 'coordinador.html',
    'Capitan': 'capitan.html',
    'Responsable de Entidad': 'responsable-entidad.html',
    'Responsable de Tienda': 'respTienda.html'
};

// Escuchamos los clics a nivel de documento para adelantarnos a cualquier otro script
document.addEventListener("click", (e) => {
    // Buscamos si el elemento clickeado es el botón de volver al inicio
    if (e.target && e.target.id === 'btn-volver-inicio') {
        e.preventDefault(); // Detenemos cualquier comportamiento nativo o inline
        e.stopPropagation(); // Evitamos que otros scripts hereden el evento

        try {
            const datosUsuario = JSON.parse(sessionStorage.getItem('user'));

            if (datosUsuario && datosUsuario.puesto) {
                const paginaDestino = PAGINAS_POR_PUESTO_GLOBAL[datosUsuario.puesto];
                window.location.href = paginaDestino || 'index.html';
            } else {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Error en el sistema de navegación global:", error);
            window.location.href = 'index.html';
        }
    }
});