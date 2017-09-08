(function(){
    "use strict";
    let marcar = null;
    let lista = null;
    let barra_inferior = null;
    let contador = null;
    let all = null;
    let completed = null;
    let active = null; 
    let borrar_completados = null;
    let tareas_marcadas = null;
    let debeMarcar = null;
    
    function init() {
        marcar = id_elemento("marcar");
        lista = id_elemento("lista");
        barra_inferior = id_elemento("barra_inferior");
        contador = id_elemento("contador");
        all = id_elemento("all");
        completed = id_elemento("completed"); 
        active = id_elemento("active");
        borrar_completados = id_elemento("borrar-completados");
        
        mostrar_tareas_pantalla();
        asignar_eventos_marcar();
        asignar_eventos_all();
        asignar_eventos_completed();
        asignar_eventos_active();
        asignar_eventos_borrar_completados();
        
        texto.onkeypress = function(oKeyEvent){
            if(oKeyEvent.charCode === 13){
                insertar_tarea(this);
            }
        };
    }

    function id_elemento(id){
        return document.getElementById(id);
    }

    function crear_elemento(elemento){
        return document.createElement(elemento);
    }

    function asignar_eventos_marcar(){
        marcar.addEventListener("click", () =>{
            if(debeMarcar){
            fetch("http://localhost:3000/completar_todo")
            .then(respuesta => respuesta.json())
            .then(mensaje =>{
                if (mensaje === "Tareas completadas ok"){
                    consultar_tareas_guardadas();
                }
            });
            }
            else{
                fetch("http://localhost:3000/pendiente_todo")
                .then(respuesta => respuesta.json())
                .then(mensaje =>{
                    if (mensaje === "Tareas pendientes ok"){
                        consultar_tareas_guardadas();
                    }
                });
            }
        });
    }

    function asignar_eventos_all(){
        all.addEventListener("click", function() {
            propiedades_elementos_foco(this);
            for (let i of Array.from(lista.children)){
                i.style.display= "list-item"
            }
        });
    }

    function asignar_eventos_completed(){
        completed.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            for (let i of Array.from(lista.children)){
                i.getAttribute("data-name") !== "1" ? i.style.display="none" : i.style.display="list-item";
            }
        });
    }

    function asignar_eventos_active(){
        active.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            for (let i of Array.from(lista.children)){
                i.getAttribute("data-name") === "1" ? i.style.display="none" : i.style.display="list-item";
            }
        });
    }

    function asignar_eventos_borrar_todo(){
        borrar_todo.addEventListener("click", () =>{
            for (let i = lista.children.length - 1; i >= 0; i--){
                if (lista.children[i].getAttribute("data-name") === "1"){
                    lista.removeChild(lista.children[i]);
                }
            }
        });
    }

    function consultar_tareas_guardadas(){
        return fetch("http://localhost:3000/consultar")
	    .then(response => response.json())
        .then(tareas => {
            return mostrar_tareas_pantalla(tareas);
        });
    }

    function mostrar_tareas_pantalla(tareas){
        tareas_marcadas = 0;
        contador.innerText = 0;
        return new Promise (resolve =>{
            while (lista.firstChild !== null){
                lista.removeChild(lista.firstChild);
            }
            for (let i in tareas){
                let renglon = crear_elemento("li");
                let checkbox = crear_elemento("input");
                let tarea = crear_elemento("div");
                let creacion = crear_elemento ("div");
                let finalizacion = crear_elemento ("div");
                let eliminar = crear_elemento("input");
                        
                asignar_eventos_renglon(renglon,eliminar);
                asignar_eventos_checkbox(checkbox,tarea);
                asignar_eventos_eliminar(eliminar,tarea);

                propiedades_elementos_pantalla(tareas[i],renglon,checkbox,tarea,creacion,finalizacion,eliminar);
                if (tareas[i].estado === "terminado"){
                    propiedades_elementos_checkbox_sinmarcar(checkbox,tarea,creacion,finalizacion);
                    tareas_marcadas += 1;
                }
                else{
                    propiedades_elementos_checkbox_marcados(checkbox,tarea,creacion,finalizacion);
                }
                
                lista.appendChild(renglon);
                renglon.appendChild(checkbox);
                renglon.appendChild(tarea);
                renglon.appendChild(creacion);
                renglon.appendChild(finalizacion);
                renglon.appendChild(eliminar);
            }
            actualizar_contador(tareas.length-tareas_marcadas);
            tareas_marcadas === tareas.length ? debeMarcar = false : debeMarcar = true;
            tareas_marcadas !== 0 ?  borrar_todo.style.display = "inline-block" : borrar_todo.style.display ="none";
            resolve (true);
        });
    }

    function asignar_eventos_renglon(renglon,eliminar){
        renglon.addEventListener("mouseover", () => mostrar_ocultar(renglon,eliminar,true));
        renglon.addEventListener("mouseleave", () => mostrar_ocultar(renglon,eliminar,false));
    }

    function mostrar_ocultar (renglon,eliminar,is_mostrar){
        let display = is_mostrar === true ? "inline-block" : "none";
        eliminar.style.display = display;
    }

    function asignar_eventos_checkbox(checkbox,tarea){
        checkbox.addEventListener("click",() => {
            fetch("http://localhost:3000/completar/" + tarea.innerText)
            .then (respuesta => respuesta.json())
            .then (mensaje =>{
                consultar_tareas_guardadas();
            });
        });
    }

    function asignar_eventos_eliminar(eliminar,tarea){
        eliminar.addEventListener("click",function(){
            fetch("http://localhost:3000/borrar/" + tarea.innerText)
            .then (respuesta => respuesta.json())
            .then (mensaje =>{
                if(mensaje === "Tarea borrada ok"){
                    consultar_tareas_guardadas();
                }
            });
        });
    }

    function propiedades_elementos_pantalla(tareas,renglon,checkbox,tarea,creacion,finalizacion,eliminar){
        renglon.className = "linea_renglon";
        checkbox.type = "checkbox";
        tarea.className = "js_alinear_items js_margen_items";
        tarea.innerText = tareas.nombre;
        creacion.className = "js_alinear_items js_margen_items";
        creacion.innerText = tareas.creacion;
        finalizacion.className = "js_alinear_items js_margen_items";
        finalizacion.innerText = tareas.finalizacion;
        eliminar.className = "botones js_boton_eliminar";
        eliminar.type = "button";
        eliminar.value = "x";
        eliminar.style.display = "none";
    }

    function propiedades_elementos_checkbox_sinmarcar(checkbox,tarea,creacion,finalizacion){
        checkbox.className = "js_alinear_items js_checkbox_marcado";
        tarea.style.textDecoration = "line-through";
        creacion.style.textDecoration = "line-through";
        finalizacion.style.textDecoration = "line-through";
        borrar_completados.style.display = "inline-block";
    }

    function propiedades_elementos_checkbox_marcados(checkbox,tarea,creacion,finalizacion){
            checkbox.className = "js_alinear_items js_checkbox";
            tarea.style.textDecoration = "none";
            creacion.style.textDecoration = "none";
            finalizacion.style.textDecoration = "none";
    }

    function actualizar_contador (numero_tareas){
        contador.innerText = numero_tareas;
        barra_inferior.style.display = "block";
        if (numero_tareas === 0){
            barra_inferior.style.display="none";
        }
    }

    function insertar_tarea(input_texto){
        let tareas = [{nombre: input_texto.value}];
        if (tareas[0].nombre !== ""){
            fetch("http://localhost:3000/insertar/" + tareas[0].nombre)
            .then(respuesta => respuesta.json())
            .then(mensaje => {
                if(mensaje === "Tarea ingresada ok"){
                    consultar_tareas_guardadas();
                }
            });
        }
        input_texto.value = "";
    }

    document.addEventListener("DOMContentLoaded", init);
}());