document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA PARA AÑADIR/QUITAR CONTACTOS DINÁMICOS ---
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

    // Como esta función se llama desde el HTML (onclick="eliminarContacto(...)"), 
    // necesitamos hacerla global asignándola a 'window'
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

    // Inicializamos con 1 contacto por defecto
    crearPlantillaContacto();

    btnAñadirContacto.addEventListener('click', () => {
        if (document.querySelectorAll('.contacto-card').length < MAX_CONTACTOS) {
            crearPlantillaContacto();
        }
    });

    // --- 2. LÓGICA DE ENVÍO A SPRING BOOT ---
    document.getElementById('formularioColaborador').addEventListener('submit', async function(e) {
        e.preventDefault();

        const payload = {
            nombre: document.getElementById('nombre').value,
            codigo_bancosol: document.getElementById('codigo').value,
            vinculado_bancosol: document.getElementById('vinculado').checked,
            domicilio: document.getElementById('domicilio').value,
            //localidad: document.getElementById('localidad').value,
            codigo_postal: document.getElementById('cpostal').value,
            num_voluntarios_estimado: parseInt(document.getElementById('voluntarios').value) || 0,        };

        const tarjetasContacto = document.querySelectorAll('.contacto-card');
        const contactosArray = [];

        tarjetasContacto.forEach((tarjeta, index) => {
            contactosArray.push({
                nombreContacto: tarjeta.querySelector('.contacto-nombre').value,
                telefono: tarjeta.querySelector('.contacto-telefono').value,
                email: tarjeta.querySelector('.contacto-email').value,
                esPrincipal: index === 0
            });
        });

        payload.contactos = contactosArray;

        console.log("Datos a enviar a Spring Boot:", JSON.stringify(payload, null, 2));

        const token = sessionStorage.getItem('token') || localStorage.getItem('token_bancosol') || '';
        const mensajeAlerta = document.getElementById('mensajeAlerta');

        try {
            // Llamamos a la función limpia de api.js (apiCrearColaborador)
            await apiCrearColaborador(payload);

            // Si no hay error, mostramos éxito visualmente
            mensajeAlerta.className = 'alert success';
            mensajeAlerta.innerText = "¡Colaborador guardado correctamente! Pendiente de validación.";
            
            // Limpiamos el formulario y los contactos extra
            document.getElementById('formularioColaborador').reset();
            contactosContainer.innerHTML = '';
            contadorContactos = 0;
            crearPlantillaContacto(); // Volvemos a dejar solo 1 contacto
            
        } catch (error) {
            // Si la función de API lanza un error, mostramos la alerta roja
            mensajeAlerta.className = 'alert error';
            mensajeAlerta.innerText = "Error al guardar el colaborador. Comprueba los datos o la conexión.";
            console.error(error);
        }
        
        mensajeAlerta.style.display = 'block';
        window.scrollTo(0, 0);
    });

});