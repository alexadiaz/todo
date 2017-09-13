(function(){
    "use strict";
    let marcar = null;
    let texto = null;
    let lista = null;
    let barra_inferior = null;
    let contador = null;
    let all = null;
    let completed = null;
    let active = null; 
    let borrar_completados = null;
    let ayuda = null;
    let pantalla_ayuda = null;
    let contenido_ayuda = null;
    let cerrar_ayuda = null;
   
    let tareas_marcadas = null;
    let tarea_vieja = null;
    let debeMarcar = null;
    let debeRenombrar = null;
   
    function init() {
        marcar = id_elemento("marcar");
        texto = id_elemento("texto");
        lista = id_elemento("lista");
        barra_inferior = id_elemento("barra_inferior");
        contador = id_elemento("contador");
        all = id_elemento("all");
        completed = id_elemento("completed"); 
        active = id_elemento("active");
        borrar_completados = id_elemento("borrar-completados");
        ayuda = id_elemento("ayuda");
        pantalla_ayuda = id_elemento("pantalla_ayuda");
        contenido_ayuda = id_elemento("contenido_ayuda");
        cerrar_ayuda = id_elemento("cerrar_ayuda");
      
        mostrar_tareas_pantalla();
        asignar_eventos_marcar();
        asignar_eventos_all();
        asignar_eventos_completed();
        asignar_eventos_active();
        asignar_eventos_ayuda();
        asignar_eventos_borrar_completados();
        
        texto.onkeypress = function (oKeyEvent){
            if(oKeyEvent.charCode === 13){
                debeRenombrar ? renombrar_tarea() : insertar_tarea();
            }
        };
    }

    function id_elemento(id){
        return document.getElementById(id);
    }

    function crear_elemento(elemento){
        return document.createElement(elemento);
    }

    function consultar_tareas_guardadas(){
        return fetch("http://localhost:3000/consultar")
	    .then(response => response.json())
    }

    function mostrar_tareas_pantalla(evento,array){
        texto.value = "";
        contador.innerText = 0;
        tareas_marcadas = 0;
        tarea_vieja = null;
        debeRenombrar = false;
        consultar_tareas_guardadas()
        .then(tareas => {
            while (lista.firstChild !== null){
                lista.removeChild(lista.firstChild);
            }
            for (let i in tareas){
                let renglon = crear_elemento("li");
                let checkbox = crear_elemento("input");
                let tarea = crear_elemento("div");
                let creacion = crear_elemento ("div");
                let finalizacion = crear_elemento ("div");
                let renombrar = crear_elemento("input");
                let eliminar = crear_elemento("input");
                        
                asignar_eventos_renglon(renglon,renombrar,eliminar);
                asignar_eventos_checkbox(checkbox,tarea);
                asignar_eventos_renombrar(renombrar,renglon,tarea);
                asignar_eventos_eliminar(eliminar,tarea);

                propiedades_elementos_pantalla(tareas[i],renglon,checkbox,tarea,creacion,finalizacion,renombrar,eliminar);
                if (tareas[i].estado === "terminado"){
                    propiedades_elementos_checkbox_sinmarcar(checkbox,tarea,creacion,finalizacion,renombrar);
                    tareas_marcadas += 1;
                    if (evento === "active"){
                        renglon.style.display= "none";
                    }
                }
                else{
                    propiedades_elementos_checkbox_marcados(checkbox,tarea,creacion,finalizacion);
                    if (evento === "completed"){
                        renglon.style.display= "none";
                    }
                }

                if (evento === "sombrear"){
                    for (let id of array){
                        if(id === tareas[i].idtareas){
                            renglon.style.background = "red";
                        }
                    }
                }
                
                lista.appendChild(renglon);
                renglon.appendChild(checkbox);
                renglon.appendChild(tarea);
                renglon.appendChild(creacion);
                renglon.appendChild(finalizacion);
                renglon.appendChild(renombrar);
                renglon.appendChild(eliminar);
            }
            actualizar_contador(tareas.length);
            tareas_marcadas === tareas.length ? debeMarcar = false : debeMarcar = true;
            tareas_marcadas !== 0 ?  borrar_completados.style.display = "inline-block" : borrar_completados.style.display ="none";
            if(evento === "sombrear"){
                setTimeout(desmarcar_consultados,3000);
            }
        });
    }

    function desmarcar_consultados(){
        for (let i in lista.childNodes){
            if(lista.childNodes[i].style.background === "red"){
                lista.childNodes[i].style.background = "transparent";
            }
        }
    }

    function asignar_eventos_marcar(){
        marcar.addEventListener("click", () =>{
            let metodo ={method:"POST"};
            if(debeMarcar){
                fetch("http://localhost:3000/completar_todo", metodo)
                .then(respuesta => respuesta.json())
                .then(mensaje =>{
                    if (mensaje === "Tareas completadas ok"){
                        mostrar_tareas_pantalla();
                    }
                });
            }
            else{
                fetch("http://localhost:3000/pendiente_todo", metodo)
                .then(respuesta => respuesta.json())
                .then(mensaje =>{
                    if (mensaje === "Tareas pendientes ok"){
                        mostrar_tareas_pantalla();
                    }
                });
            }
        });
    }

    function asignar_eventos_renglon(renglon,renombrar,eliminar){
        renglon.addEventListener("mouseover", () => mostrar_ocultar(renglon,renombrar,eliminar,true));
        renglon.addEventListener("mouseleave", () => mostrar_ocultar(renglon,renombrar,eliminar,false));
    }

    function mostrar_ocultar (renglon,renombrar,eliminar,is_mostrar){
        let display = is_mostrar === true ? "inline-block" : "none";
        renombrar.style.display = display;
        eliminar.style.display = display;
    }

    function asignar_eventos_checkbox(checkbox,tarea){
        checkbox.addEventListener("click",() => {
            let contenido = crear_contenido_post(tarea.innerText);
            fetch("http://localhost:3000/completar", contenido)
            .then (respuesta => respuesta.json())
            .then (mensaje =>{
                mostrar_tareas_pantalla();
            });
        });
    }

    function asignar_eventos_renombrar(renombrar,renglon,tarea){
        renombrar.addEventListener("click", () =>{
            if(tarea_vieja === null && renombrar.value === "renombrar"){
                renglon.style.background = "yellow";
                texto.value = tarea.innerText;
                texto.focus();
                tarea_vieja = tarea.innerText;
                renombrar.value = "cancelar";
                debeRenombrar = true;
            }
            else if(tarea_vieja !== null &  renombrar.value === "cancelar"){
                renglon.style.background = "transparent";
                texto.value ="";
                tarea_vieja = null;
                renombrar.value = "renombrar";
                debeRenombrar = false;
            }
        });
    }

    function asignar_eventos_eliminar(eliminar,tarea){
        eliminar.addEventListener("click",() =>{
            let contenido = crear_contenido_post(tarea.innerText);
            fetch("http://localhost:3000/borrar/", contenido)
            .then (respuesta => respuesta.json())
            .then (mensaje =>{
                if(mensaje === "Tarea borrada ok"){
                    mostrar_tareas_pantalla();
                }
            });
        });
    }

    function propiedades_elementos_pantalla(tareas,renglon,checkbox,tarea,creacion,finalizacion,renombrar,eliminar){
        renglon.className = "linea_renglon";
        checkbox.type = "checkbox";
        tarea.className = "js_alinear_items js_margen_items";
        tarea.innerText = tareas.nombre;
        creacion.className = "js_alinear_items js_margen_items";
        creacion.innerText = tareas.creacion;
        finalizacion.className = "js_alinear_items js_margen_items";
        finalizacion.innerText = tareas.finalizacion;
        renombrar.className = "botones js_boton_renombrar";
        renombrar.type = "button";
        renombrar.value = "renombrar"
        renombrar.style.display = "none";
        eliminar.className = "botones js_boton_eliminar";
        eliminar.type = "button";
        eliminar.value = "x";
        eliminar.style.display = "none";
    }

    function propiedades_elementos_checkbox_sinmarcar(checkbox,tarea,creacion,finalizacion,renombrar){
        checkbox.className = "js_alinear_items js_checkbox_marcado";
        tarea.style.textDecoration = "line-through";
        creacion.style.textDecoration = "line-through";
        finalizacion.style.textDecoration = "line-through";
        borrar_completados.style.display = "inline-block";
        renombrar.disabled = true;
        renombrar.style.color ="gray";
    }

    function propiedades_elementos_checkbox_marcados(checkbox,tarea,creacion,finalizacion){
        checkbox.className = "js_alinear_items js_checkbox";
        tarea.style.textDecoration = "none";
        creacion.style.textDecoration = "none";
        finalizacion.style.textDecoration = "none";
    }

    function actualizar_contador (numero_tareas){
        let pendientes = numero_tareas - tareas_marcadas;
        pendientes === 1 ? contador.innerText = pendientes + " tarea pendiente" : contador.innerText = pendientes + " tareas pendientes";
        barra_inferior.style.display = "block";
        if (numero_tareas === 0){
            barra_inferior.style.display="none";
        }
    }

    function asignar_eventos_all(){
        all.addEventListener("click", function() {
            propiedades_elementos_foco(this);
            mostrar_tareas_pantalla();
        });
    }

    function asignar_eventos_completed(){
        completed.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            mostrar_tareas_pantalla("completed");
        });
    }

    function asignar_eventos_active(){
        active.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            mostrar_tareas_pantalla("active");
        });
    }

    function propiedades_elementos_foco(boton_actual){
        all.classList.remove("foco");
        completed.classList.remove("foco");
        active.classList.remove("foco");
        ayuda.classList.remove("foco");
        borrar_completados.classList.remove("foco");
        
        boton_actual.classList.add("foco");
    }

    function asignar_eventos_ayuda(){
        ayuda.addEventListener("click", function(){
            propiedades_elementos_foco(this); 
            fetch("http://localhost:3000/ayuda")
            .then(resultado => resultado.json())
            .then(datos =>{
                while (contenido_ayuda.firstChild !== null){
                    contenido_ayuda.removeChild(contenido_ayuda.firstChild);
                }
                for(let i in datos){
                    let informacion = crear_elemento("div");
                    informacion.innerText = "- " + datos[i];
                    contenido_ayuda.appendChild(informacion);
                }
                pantalla_ayuda.classList.remove("pantalla_ayuda_ocultar");
                pantalla_ayuda.classList.add ("js_pantalla_ayuda");
                asignar_eventos_cerrar_ayuda();
            });
        });
    }

    function asignar_eventos_cerrar_ayuda(){
        cerrar_ayuda.addEventListener("click", () =>{
            pantalla_ayuda.classList.remove("js_pantalla_ayuda");
            pantalla_ayuda.classList.add ("pantalla_ayuda_ocultar");
        });
    }

    function asignar_eventos_borrar_completados(){
        borrar_completados.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            let metodo ={method:"POST"};
            fetch("http://localhost:3000/borrar_completados", metodo)
            .then(respuesta => respuesta.json())
            .then(mensaje =>{
                if (mensaje === "Tareas borradas ok"){
                    mostrar_tareas_pantalla();
                }
            });
        });
    }

    function insertar_tarea(){
        let tarea = texto.value;
        if (tarea !== ""){
            fetch("http://localhost:3000/consultar_tarea?tarea=" + tarea)
            .then(resultado => resultado.json())
            .then(tareas =>{
                if (tareas === "No se encontraron coincidencias"){
                    let contenido = crear_contenido_post(tarea);
                    return fetch("http://localhost:3000/insertar", contenido)
                    .then(respuesta => respuesta.json())
                    .then(mensaje => "Tarea ingresada ok");
                }
                else{
                    let sombrear =[];
                    for(let i in tareas){
                        sombrear.push(tareas[i].idtareas);
                    }
                    return sombrear;
                }
            }).then(resultado =>{
                resultado === "Tarea ingresada ok" ? mostrar_tareas_pantalla():mostrar_tareas_pantalla("sombrear",resultado);
            });
        }
    }

    function renombrar_tarea(){
        let nueva = texto.value;
        let contenido = crear_contenido_post(tarea_vieja,nueva);
        fetch("http://localhost:3000/renombrar", contenido)
        .then(respuesta => respuesta.json())
        .then(mensaje => {
            mensaje === "La tarea ya existe" ? texto.value = "" : mostrar_tareas_pantalla();
        });
    }

    function crear_contenido_post(nombre_tarea,nueva_tarea){
        let tarea_string = null;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type","application/json");
        nueva_tarea === undefined ? tarea_string = JSON.stringify({tarea:nombre_tarea}) : tarea_string = JSON.stringify({tarea:nombre_tarea,nueva:nueva_tarea});
        
        let contenido ={method:"POST",
                        headers:myHeaders,
                        body:tarea_string};
        return contenido;
    }

    document.addEventListener("DOMContentLoaded", init);
}());