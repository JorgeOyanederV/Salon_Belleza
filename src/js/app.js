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
    }else{
        elemento.classList.add('seleccionado');
    }
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
    }
    mostrarSeccion();
}
function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios } = cita;
    //Validacion
    if (Object.values(cita).includes('')) {
        
    }
}