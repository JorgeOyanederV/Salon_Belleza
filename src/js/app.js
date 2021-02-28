document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})
function iniciarApp(){
    mostrarServicios();
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
    console.log(elemento.classList);
}