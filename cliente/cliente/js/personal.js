/**
 * Mapeo exclusivo de la tarjeta de datos de perfil y enrutado dinámico
 */
document.addEventListener("DOMContentLoaded", () => {
    const userString = sessionStorage.getItem('user');
    if (!sessionStorage.getItem('token') || !userString) {
        return;
    }

    try {
        const usuarioLogueado = JSON.parse(userString);

        if (usuarioLogueado) {
            // 1. Rellenar los campos de la tarjeta (ID, Nombre, Puesto)
            const idContenedor = document.getElementById('perfil-id');
            if (idContenedor) {
                idContenedor.textContent = usuarioLogueado.id_usuario || usuarioLogueado.idUsuario || 'N/A';
            }

            const usernameContenedor = document.getElementById('perfil-username');
            if (usernameContenedor) {
                usernameContenedor.textContent = usuarioLogueado.nombre || 'No definido';
            }

            const puestoContenedor = document.getElementById('perfil-puesto');
            if (puestoContenedor) {
                puestoContenedor.textContent = usuarioLogueado.puesto || 'Usuario';
            }

            // 2. 🌟 ENRUTADO DINÁMICO PARA EL BOTÓN INICIO
            const btnInicio = document.getElementById('btn-inicio-perfil');
            if (btnInicio) {
                btnInicio.addEventListener('click', (e) => {
                    e.preventDefault();

                    const puesto = usuarioLogueado.puesto;

                    // Diccionario idéntico al de tu index.js para redirigir bien
                    const paginasPorPuesto = {
                        'Administrador': 'admin.html',
                        'Capitan': 'capitan.html',
                        'Coordinador': 'coordinador.html',
                        'Responsable de Entidad': 'responsable-entidad.html',
                        'Responsable de Tienda': 'respTienda.html'
                    };

                    // Si el puesto existe en el mapa nos redirige a su archivo, si no, al login por seguridad
                    const paginaDestino = paginasPorPuesto[puesto] || 'index.html';
                    window.location.href = paginaDestino;
                });
            }
        }
    } catch (error) {
        console.error("Error al procesar el renderizado secundario del perfil:", error);
    }
});