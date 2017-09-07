
(function(){
    "use strict";
    let marcar = null;
    let lista = null;
    let barra_inferior = null;
    let contador = null;
    let all = null;
    let completed = null;
    let active = null; 
    let borrar_todo = null;
    
    function init() {
        marcar = id_elemento("marcar");
        lista = id_elemento("lista");
        barra_inferior = id_elemento("barra_inferior");
        contador = id_elemento("contador");
        all = id_elemento("all");
        completed = id_elemento("completed"); 
        active = id_elemento("active");
        borrar_todo = id_elemento("borrar-todo");
        
        asignar_eventos_marcar();
        asignar_eventos_all();
        asignar_eventos_completed();
        asignar_eventos_active();
        asignar_eventos_borrar_todo();
        consultar_tareas_guardadas();
        
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
            let div = lista.querySelectorAll("div");
            let input = lista.querySelectorAll("input.js_alinear_items");
            let debeMarcar = null;
            if(marcar.getAttribute("data-estado") === "ninguno"){
                debeMarcar = true;
                propiedades_elementos_marcar(true);
            }    
            else {
                debeMarcar = false;
                propiedades_elementos_marcar(false);
            }
            for (let i in Array.from(lista.children)){
                if(debeMarcar === true) {
                    lista.children[i].setAttribute("data-name","1");
                    div[i].style.textDecoration = "line-through";
                    input[i].className="js_alinear_items js_checkbox_marcado";
                }
                else {   
                    lista.children[i].setAttribute("data-name","");
                    div[i].style.textDecoration = "none";
                    input[i].className="js_alinear_items js_checkbox";
                }
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
                        
                asignar_eventos_renglon(renglon);
                asignar_eventos_checkbox(renglon,checkbox,tarea);
                asignar_eventos_eliminar(eliminar,tarea);

                propiedades_elementos_pantalla(tareas[i],renglon,checkbox,tarea,creacion,finalizacion,eliminar);
                if (finalizacion.innerText !== ""){
                    propiedades_elementos_checkbox_sinmarcar(true,renglon,checkbox,tarea);
                }
                
                lista.appendChild(renglon);
                renglon.appendChild(checkbox);
                renglon.appendChild(tarea);
                renglon.appendChild(creacion);
                renglon.appendChild(finalizacion);
                renglon.appendChild(eliminar);
            }
            contador.innerText =0;
            actualizar_contador(true,tareas.length);
            resolve (true);
        });
    }

    function asignar_eventos_renglon(renglon){
        renglon.addEventListener("mouseover", () => mostrar_ocultar(renglon,true));
        renglon.addEventListener("mouseleave", () => mostrar_ocultar(renglon,false));
    }

    function asignar_eventos_checkbox(renglon,checkbox,tarea){
        checkbox.addEventListener("click",() => {
            let renglones_marcados = null;
            let debeMarcar = null;
            if (tarea.style.textDecoration !== "line-through"){
                fetch("http://localhost:3000/completar/" + tarea.innerText)
                .then (respuesta => respuesta.json())
                .then (mensaje =>{
                    if(mensaje === "Tarea completada ok"){
                        return consultar_tareas_guardadas();
                    }
                }).then (() =>{
                    renglones_marcados = renglones_line_through();
                    if (renglones_marcados === lista.children.length){
                        propiedades_elementos_checkbox_sinmarcar(false);
                        debeMarcar=false;
                    }
                });
            }
            else{
                propiedades_elementos_checkbox_marcados(true,renglon,checkbox,tarea);
                debeMarcar=true;
                renglones_marcados = renglones_line_through();
                renglones_marcados !== 0 ?  propiedades_elementos_checkbox_marcados(false,"inline-block") :  propiedades_elementos_checkbox_marcados(false,"none");
                actualizar_contador(true,1);
            }
        });
    }

    function asignar_eventos_eliminar(eliminar,tarea){
        eliminar.addEventListener("click",function(){
            if (tarea.style.textDecoration !== "line-through"){
                actualizar_contador(false,1);
            }
            fetch("http://localhost:3000/borrar/" + tarea.innerText)
            .then (respuesta => respuesta.json())
            .then (mensaje =>{
                if(mensaje === "Tarea borrada ok"){
                    consultar_tareas_guardadas();
                }
            });
            if(lista.children.length === 0){
                barra_inferior.style.display="none";
                marcar.setAttribute("data-estado", "ninguno");
            }
        });
    }

    function propiedades_elementos_pantalla(tareas,renglon,checkbox,tarea,creacion,finalizacion,eliminar){
        renglon.className = "linea_renglon";
        checkbox.className = "js_alinear_items js_checkbox";
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

    function propiedades_elementos_marcar(accion){
        if (accion){
            marcar.setAttribute("data-estado", "todos");
            borrar_todo.style.display="inline-block";
            contador.innerText = "0"; 
            return;
        }
        marcar.setAttribute("data-estado", "ninguno");
        borrar_todo.style.display="none";
        contador.innerText = lista.children.length;
    }

    function propiedades_elementos_foco(boton_actual){
        all.classList.remove("foco");
        completed.classList.remove("foco");
        active.classList.remove("foco");
        
        boton_actual.classList.add("foco");
    }

    function propiedades_elementos_checkbox_sinmarcar(accion,renglon,checkbox,tarea){
        if(accion){
            renglon.setAttribute("data-name","1");
            checkbox.className = "js_alinear_items js_checkbox_marcado";
            tarea.style.textDecoration = "line-through";
            borrar_todo.style.display = "inline-block";
            return;
        }
        marcar.setAttribute("data-estado","todos");
    }

    function propiedades_elementos_checkbox_marcados(accion,renglon,checkbox,tarea){
        if(accion){
            renglon.setAttribute("data-name","0")
            checkbox.className = "js_alinear_items js_checkbox";
            tarea.style.textDecoration = "none";
            marcar.setAttribute("data-estado","ninguno");
            return;
        }
            borrar_todo.style.display = renglon;
    }
   
    function propiedades_elementos_contador(accion,elemento1,elemento2){
        if(accion){
            barra_inferior.style.display = elemento1;
            marcar.setAttribute("data-estado",elemento2);
            return;
        }
        marcar.setAttribute("data-estado",elemento1);
    }

    function renglones_line_through(){
        let count =0;
        for (let i of Array.from(lista.children)){
            if (i.getAttribute("data-name") === "1") {
                count += 1;
            }
        }
        return count;
    }

    function mostrar_ocultar (renglon,is_mostrar){
        let display = is_mostrar === true ? "inline-block" : "none";
        let eliminar = renglon.querySelector(".js_boton_eliminar")
        eliminar.style.display = display;
    }

    function actualizar_contador (operador,numero_tareas){
        let numero = parseInt(contador.innerText);
        if (operador){
            contador.innerText = numero_tareas - renglones_line_through();
            propiedades_elementos_contador(true,"block","ninguno");
        }
        else{
            contador.innerText = numero - numero_tareas;
            if (lista.children.length === 0){
                propiedades_elementos_contador(true,"none","ninguno");
            }
            if (contador.innerText === "0"){
                propiedades_elementos_contador(false,"todos");
            }
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