document.addEventListener('DOMContentLoaded', async () => {
    const map = L.map('map').setView([40.4167, -3.7033], 6);
    let allTiendas = []; // Guardaremos todas para filtrar sin llamar a la API cada vez
    let markersLayer = L.layerGroup().addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Inputs de búsqueda
    const inputNombre = document.getElementById('busquedaNombre');
    const inputCP = document.getElementById('busquedaCP');
    const btnLimpiar = document.getElementById('btnLimpiar');

    async function cargarYMostrarTiendas() {
        try {
            // Obtenemos los datos mediante la función de api.js[cite: 1]
            allTiendas = await obtenerTiendas();
            renderTiendas(allTiendas);
        } catch (error) {
            console.error("Error cargando tiendas:", error);
        }
    }

    function renderTiendas(tiendasFiltradas) {
        markersLayer.clearLayers(); // Limpiamos marcadores previos

        tiendasFiltradas.forEach(tienda => {
            if (tienda.latitud && tienda.longitud) {
                const marker = L.marker([tienda.latitud, tienda.longitud]);

                const contenidoPopup = `
                    <div style="line-height: 1.5;">
                        <strong style="font-size: 1.1em; color: #2563eb;">${tienda.resena_nombre || 'Sin nombre'}</strong><br>
                        <b>Dirección:</b> ${tienda.domicilio || 'N/A'}<br>
                        <b>CP:</b> ${tienda.codigo_postal || 'N/A'}<br> 
                        <b>Localidad:</b> ${tienda.localidad || 'N/A'}
                    </div>
                `;
                marker.bindPopup(contenidoPopup);
                markersLayer.addLayer(marker);
            }
        });

        // Si solo hay un resultado, centrar el mapa
        if (tiendasFiltradas.length === 1) {
            const t = tiendasFiltradas[0];
            map.setView([t.latitud, t.longitud], 14);
        }
    }

    function aplicarFiltros() {
        const nombreBusqueda = inputNombre.value.toLowerCase();
        const cpBusqueda = inputCP.value.trim();

        const filtradas = allTiendas.filter(tienda => {
            const nombreTienda = (tienda.resena_nombre || "").toLowerCase();
            const cumpleNombre = nombreTienda.includes(nombreBusqueda);

            const cpTienda = (tienda.codigo_postal || "").toString();
            const cumpleCP = cpBusqueda === "" || cpTienda.includes(cpBusqueda);

            return cumpleNombre && cumpleCP;
        });
        renderTiendas(filtradas);
    }

    // Eventos
    inputNombre.addEventListener('input', aplicarFiltros);
    inputCP.addEventListener('input', aplicarFiltros);

    btnLimpiar.addEventListener('click', () => {
        inputNombre.value = "";
        inputCP.value = "";
        renderTiendas(allTiendas);
        map.setView([40.4167, -3.7033], 6);
    });

    // Carga inicial
    cargarYMostrarTiendas();
});