document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializar mapa
    const map = L.map('map').setView([40.4167, -3.7033], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    try {
        // 2. Llamada a la función de api.js
        const tiendas = await obtenerTiendas();
        console.log("Datos recibidos del DTO:", tiendas); // Revisa esto en la consola F12

        tiendas.forEach(tienda => {
            // Verificamos coordenadas
            if (tienda.latitud && tienda.longitud) {

                // 3. Crear el marcador y añadirlo al mapa PRIMERO
                const marker = L.marker([tienda.latitud, tienda.longitud]).addTo(map);

                // 4. Vincular el popup con los nombres EXACTOS del DTO
                // Importante: No uses 'resena_nombre' si en el DTO pusiste 'nombre'
                const contenidoPopup = `
                    <div style="line-height: 1.5;">
                        <strong style="font-size: 1.1em;">${tienda.nombre || 'Sin nombre'}</strong><br>
                        <b>Dirección:</b> ${tienda.domicilio || 'N/A'}<br>
                        <b>Localidad:</b> ${tienda.localidad || 'N/A'}
                    </div>
                `;

                marker.bindPopup(contenidoPopup);

                // Opcional: abrir el popup al hacer mouseover en vez de click
                // marker.on('mouseover', function (e) { this.openPopup(); });
            }
        });

    } catch (error) {
        console.error("Error en mapa.js:", error);
    }
});