document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================================
    // BLOQUE 1: CARGAR DESPLEGABLE DE LOCALIDADES AL INICIO
    // ========================================================
    async function cargarLocalidades() {
        try {
            // Llama a la función de tu api.js
            const localidades = await obtenerLocalidades(); 
            const selectLocalidad = document.getElementById('localidad');
            
            selectLocalidad.innerHTML = '<option value="">-- Selecciona una localidad --</option>';
            
            localidades.forEach(loc => {
                // Rellena el select con el ID en el value y el nombre en el texto
                selectLocalidad.innerHTML += `<option value="${loc.id}">${loc.nombre}</option>`;
            });
        } catch (error) {
            console.error("Error al cargar localidades", error);
            document.getElementById('localidad').innerHTML = '<option value="">Error al cargar</option>';
        }
    }
    
    cargarLocalidades(); // Arrancamos esta función nada más cargar la página


    // ========================================================
    // BLOQUE 2: LÓGICA DE LOS CONTACTOS DINÁMICOS (Añadir/Quitar)
    // ========================================================
    const contactosContainer = document.getElementById('contactosContainer');
    const btnAñadirContacto = document.getElementById('btnAñadirContacto');
    let contadorContactos = 0;
    const MAX_CONTACTOS = 3;

    function crearPlantillaContacto() {
        contadorContactos++;
        const div = document.createElement('div');
        div.className = 'contacto-card';
        div.id = `contacto-${contadorContactos}`;

        div.innerHTML = `
                <strong style="display:block; margin-bottom:10px; color:#004b87;">Contacto ${contadorContactos} ${contadorContactos === 1 ? '(Principal)' : ''}</strong>
                ${contadorContactos > 1 ? `<button type="button" class="btn-remove" onclick="eliminarContacto(${contadorContactos})">X Quitar</button>` : ''}

                <div class="form-grid" style="margin-bottom: 0;">
                    <div class="form-group full-width">
                        <label>Nombre y Cargo *</label>
                        <input type="text" class="contacto-nombre" required placeholder="Ej: Maria Vallejo (Concejala)">
                    </div>
                    <div class="form-group">
                        <label>Teléfono *</label>
                        <input type="tel" class="contacto-telefono" required placeholder="Ej: 600 123 456">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="contacto-email" placeholder="Ej: correo@ejemplo.com">
                    </div>
                </div>
            `;
        contactosContainer.appendChild(div);
        actualizarBotonAñadir();
    }

    // La función para eliminar se hace global (window) para que el HTML pueda llamarla
    window.eliminarContacto = function(id) {
        const elemento = document.getElementById(`contacto-${id}`);
        if (elemento) {
            elemento.remove();
            contadorContactos--;
            actualizarBotonAñadir();
        }
    }

    function actualizarBotonAñadir() {
        if (document.querySelectorAll('.contacto-card').length >= MAX_CONTACTOS) {
            btnAñadirContacto.style.display = 'none';
        } else {
            btnAñadirContacto.style.display = 'inline-block';
        }
    }

    crearPlantillaContacto(); // Creamos el primer contacto obligatorio al cargar

    btnAñadirContacto.addEventListener('click', () => {
        if (document.querySelectorAll('.contacto-card').length < MAX_CONTACTOS) {
            crearPlantillaContacto();
        }
    });


    // ========================================================
    // BLOQUE 3: RECOGER DATOS Y ENVIAR EL FORMULARIO (POST)
    // ========================================================
    document.getElementById('formularioColaborador').addEventListener('submit', async function(e) {
        e.preventDefault();

        // 3.1 Construimos el objeto principal exactamente como lo pide Java
        const payload = {
            nombre: document.getElementById('nombre').value,
            codigo_bancosol: document.getElementById('codigo').value,
            vinculado_bancosol: document.getElementById('vinculado').checked,
            domicilio: document.getElementById('domicilio').value,
            codigo_postal: document.getElementById('cpostal').value,
            observaciones: document.getElementById('observaciones').value,
            
            // Pasamos la Localidad como un objeto con su ID
            // ATENCIÓN: Si en Java el atributo de la ID se llama distinto (ej: idLocalidad), cambialo aquí abajo
            localidad: { 
                id: parseInt(document.getElementById('localidad').value) 
            }
        };

        // 3.2 Recogemos todas las tarjetas de contactos que haya en pantalla
        const tarjetasContacto = document.querySelectorAll('.contacto-card');
        const contactosArray = [];

        tarjetasContacto.forEach((tarjeta, index) => {
            contactosArray.push({
                nombreContacto: tarjeta.querySelector('.contacto-nombre').value, // Formato camelCase para Java
                telefono: tarjeta.querySelector('.contacto-telefono').value,
                email: tarjeta.querySelector('.contacto-email').value,
                esPrincipal: index === 0 // El primero siempre es el principal
            });
        });

        // 3.3 Metemos los contactos dentro del paquete principal
        payload.contactos = contactosArray;

        const mensajeAlerta = document.getElementById('mensajeAlerta');

        // 3.4 Enviamos el paquete a la API (Spring Boot)
        try {
            await apiCrearColaborador(payload);

            // Si todo va bien: Mensaje verde y resetear formulario
            mensajeAlerta.className = 'alert success';
            mensajeAlerta.innerText = "¡Colaborador guardado correctamente! Pendiente de validación.";
            
            document.getElementById('formularioColaborador').reset();
            contactosContainer.innerHTML = '';
            contadorContactos = 0;
            crearPlantillaContacto(); // Volvemos a dejar un contacto vacío
            
        } catch (error) {
            // Si algo falla: Mensaje rojo
            mensajeAlerta.className = 'alert error';
            mensajeAlerta.innerText = "Error al guardar el colaborador. Comprueba los datos o la consola.";
            console.error(error);
        }
        
        mensajeAlerta.style.display = 'block';
        window.scrollTo(0, 0); // Sube la pantalla arriba para que el usuario vea el mensaje
    });

});