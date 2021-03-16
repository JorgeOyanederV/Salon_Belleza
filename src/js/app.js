let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}
//Iniciamos la aplicacion
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})
function iniciarApp(){
    mostrarServicios();
    // resalta la seccion actual
    mostrarSeccion();
    //oculta la seccion segun el tab en que se encuentra 
    cambiarSeccion();
    // Paginacion
    paginaSiguiente();
    paginaAnterior();
    // Comprueba la pagina actual para mostrar la paginacion
    botonesPaginador();
    // Muestra el resuen de la cita(o mensaje de error en caso de no pasasr la validacion)
    mostrarResumen();
    // Almacena el nombre de la cita en el objeto
    nombreCita();
    // Almacena la fecha de la cita en el objeto
    fechaCita();
    // Deshabilitar dias pasados
    deshabilitarFechaAnterior();
    // Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion(){
    // Eliminar primero la seccion anterior con mostrar seccion
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    // Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', evento => {
            evento.preventDefault();
            pagina = parseInt(evento.target.dataset.paso);
            // Llamar a la funcion mostrarSeccion para actualizar
            mostrarSeccion();
            botonesPaginador();
        })
    })
}
async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;
        //Generando el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;
            //DOM Script
            //Generando Nombre del Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Generando el Precio del Servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            //Generando Div Contenedor del Servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            // Agregamos el evento de click
            servicioDiv.onclick = seleccionarServicio;
            // Agregando un identificador
            servicioDiv.dataset.idServicio = id;
            //Inyeccion de precio y nombre
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            // Agregando al HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) { console.log(error); }
}

function seleccionarServicio(evento){
    let elemento;
    //forzar la intereaccion con el div
    if(evento.target.tagName === 'P') {
        elemento = evento.target.parentElement;
    }else{
        elemento = evento.target;
    }
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');
        const nombreServicio = elemento.firstElementChild.textContent;
        const precioServicio = elemento.firstElementChild.nextElementSibling.textContent;
        // console.log(elemento);
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: nombreServicio,
            precio: precioServicio
        }
        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}
function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = cita.servicios.filter(servicio => servicio.id !== id);
    //console.log(cita.servicios);
}
function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    //console.log(cita.servicios);
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}
function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if( pagina === 2){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else{
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); // Estamos en la pagina 3 cargamos el resumen
    }
    mostrarSeccion();
}
function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios } = cita;
    // Seleccionar el div de resumen 
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    //resumenDiv.innerHTML = ''; Mala practica

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //Validacion del formulario y servicios
    if (Object.values(cita).includes('')) { // revisamos que no haya ningun espacio vacio
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o hora.'

        noServicios.classList.add('invalidar-cita');
        // agregar a mensaje resumen div
        resumenDiv.appendChild(noServicios);
    } else {
        const headingCita= document.createElement('H3');
        headingCita.textContent = 'Resumen de Cita';

        // Mostrar el Resumen
        const nombreCita = document.createElement('P');
        //nombreCita.textContent = `<span>Nombre:<span> ${nombre}`
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora}`

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';

        let cantidad = 0;
        // Iterar sobre el arreglo de servicios
        servicios.forEach(servicio => {
            const { nombre, precio } = servicio;
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio');

            const totalServicio = precio.split('$');
            //console.log(parseInt(totalServicio[1].trim()));
            cantidad += parseInt(totalServicio[1].trim());
            // Colocar texto y precio
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);
        })
        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(headingServicios);
        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;

        resumenDiv.appendChild(cantidadPagar);
    }
}
function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', evento => {
        const nombreTexto = evento.target.value.trim();
        // validacion
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre No Valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){
    // Si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
        //alertaPrevia.remove();
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if (tipo === 'error') {
        alerta.classList.add('error');
    }
    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta luego de 4 segundos 
    setTimeout(() => {
        alerta.remove();
    }, 4000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', evento => {
        const dia = new Date(evento.target.value).getUTCDay(); // retorna el dia como numero 
        if ([0,6].includes(dia)) { // si el valor 0 o 6 esta incluido en el dia
            evento.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no Permitidos','error')
        } else{
            cita.fecha = fechaInput.value;
        }
    })
}
function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    let year = fechaAhora.getFullYear();
    let month = fechaAhora.getMonth() + 1; // Debido a que los meses comienzan desde 0 
    let day = fechaAhora.getDate() + 1;
    if (month < 10) { // El mes debe tener dos digitos
        month = `0${month}`;
    }
    if (day < 10) { // El dia debe tener dos digitos
        day = `0${day}`;
    }
    // Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${month}-${day}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', evento => {
        const horaCita = evento.target.value;
        const hora = horaCita.split(':');
        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            cita.hora = '';
            inputHora.value = '';
        } else {
            //console.log('horas validas');
            cita.hora = horaCita;
        }
        //console.log(cita);
    });
}