let pagina = 1;
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
}

function mostrarSeccion(){
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
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
            // Eliminar primero la seccion anterior con mostrar seccion
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');
            // Agrega mostrar seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');
            // Eliminar la clase actual en el tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');
            // Agregar la clase actual en el tab actual 
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');
        })
    })
}
async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;
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
    } catch (error) {
        console.log(error);
    }
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