
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
        
        consultar_tareas_guardadas();
        
        texto.onkeypress = function(oKeyEvent){
            if(oKeyEvent.charCode === 13){
                insertar_tarea(this);
            }
        };

        //asignar_eventos_marcar(marcar);
        asignar_eventos_all();
        asignar_eventos_completed();
        asignar_eventos_active();
        asignar_eventos_borrar_todo();
    }

    function asignar_eventos_marcar(marcar){
        /*marcar.addEventListener("click",function(){

            var ul= document.getElementById("lista");
            var lis = ul.children;
            var div = ul.querySelectorAll("div");
            var input = ul.querySelectorAll("input.js_alinear_items");
            var borrar = document.getElementById("borrar-todo");
            var mostrar = document.getElementById("contador");
            var debeMarcar = null;

            if(marcar.getAttribute("data-estado") === "ninguno"){
                debeMarcar = true;
                marcar.setAttribute("data-estado", "todos");
                borrar.style.display="inline-block";
                mostrar.innerText = "0"; 
            }    
            else {
                debeMarcar = false;
                marcar.setAttribute("data-estado", "ninguno");
                borrar.style.display="none";
            }

        for (var i=0; i<lis.length;i++){
                
                if(debeMarcar === true) {
                    lis[i].setAttribute("name","1");
                    div[i].style.textDecoration = "line-through";
                    input[i].className="js_alinear_items js_checkbox_marcado";
                }
                else {   
                    lis[i].setAttribute("name","");
                    div[i].style.textDecoration = "none";
                    input[i].className="js_alinear_items js_checkbox";
                    actualizar_contador(true);
                }
            }
        });*/
    }

    function propiedades_elementos_foco(boton_actual){
        all.classList.remove("foco");
        completed.classList.remove("foco");
        active.classList.remove("foco");
        
        boton_actual.classList.add("foco");
    }

    function asignar_eventos_all(){
        all.addEventListener("click", function() {
            propiedades_elementos_foco(this);
            for (let i of lista.children){
                i.style.display= "list-item"
            }
        });
    }

    function asignar_eventos_completed(){
        completed.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            for (let i of lista.children){
                i.getAttribute("data-name") !== "1" ? i.style.display="none" : i.style.display="list-item";
            }
        });
    }

    function asignar_eventos_active(){
        active.addEventListener("click", function(){
            propiedades_elementos_foco(this);
            for (let i of lista.children){
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

    function asignar_eventos_eliminar(textoElement){
        /*boton eliminar
        nuevoInputElement.addEventListener("click",function(){
            var li =this.parentNode;
            var ul = li.parentNode;
        
            if (nuevoDivElement.style.textDecoration !== "line-through"){
                actualizar_contador(false);
            }
            
            ul.removeChild(li);
            
            if(ul.children.length === 0){
                barra_inferior.style.display="none";
                marcar = document.getElementById("marcar");
                marcar.setAttribute("data-estado", "ninguno");
            }
        });*/
    }

    function consultar_tareas_guardadas(){
        fetch("http://localhost:3000/consultar")
	    .then(response => response.json())
        .then(tareas => {
            mostrar_tareas_pantalla(tareas);
        });
    }

    function mostrar_tareas_pantalla(tareas){
        for (let i in tareas){
            let nombre_tarea = tareas[i].nombre;
            
            let renglon = crear_elemento("li");
            let checkbox = crear_elemento("input");
            let tarea = crear_elemento("div");
            let eliminar = crear_elemento("input");
            
            asignar_propiedades("pantalla","renglon",renglon);
            asignar_propiedades("pantalla","checkbox",checkbox);
            asignar_propiedades("pantalla","tarea",tarea,nombre_tarea);
            asignar_propiedades("pantalla","eliminar",eliminar);

            asignar_eventos_renglon(renglon);
            asignar_eventos_checkbox(renglon,checkbox,tarea);
            //asignar_eventos_eliminar();
            
            lista.appendChild(renglon);
            renglon.appendChild(checkbox);
            renglon.appendChild(tarea);
            renglon.appendChild(eliminar);
        }
        actualizar_contador(true,tareas.length);
    }

    function id_elemento(id){
        return document.getElementById(id);
    }

    function crear_elemento(elemento){
        return document.createElement(elemento);
    }

    function asignar_propiedades(funcion,accion,elemento,nombre_tarea){
        if (funcion === "pantalla"){
            propiedades_elementos_pantalla(accion,elemento,nombre_tarea);
        }
        else if (funcion === "checkbox_sinmarcar"){
            propiedades_elementos_checkbox_sinmarcar(accion,elemento);
        }
        else if (funcion === "checkbox_marcados"){
            propiedades_elementos_checkbox_marcados(accion,elemento);
        }
        else if (funcion === "contador"){
            propiedades_elementos_contador(accion,elemento);
        }
    }

    function propiedades_elementos_pantalla(accion,elemento,nombre_tarea){
        switch(accion){
            case "renglon":
                elemento.className = "linea_renglon";
            break;
            case "checkbox":
                elemento.className = "js_alinear_items js_checkbox";
                elemento.type = "checkbox";
            break;
            case "tarea":
                elemento.className = "js_alinear_items js_margen_items";
                elemento.innerText = nombre_tarea;
            break;
            case "eliminar":
                elemento.className = "botones js_boton_eliminar";
                elemento.type = "button";
                elemento.value = "x";
                elemento.style.display = "none";
            break;
        }
    }

    function propiedades_elementos_checkbox_sinmarcar(accion,elemento){
        switch(accion){
            case "renglon":
                elemento.setAttribute("data-name","1");
            break;
            case "checkbox":
                elemento.className = "js_alinear_items js_checkbox_marcado";
            break;
            case "tarea":
                elemento.style.textDecoration = "line-through";
            break;
            case "borrar_todo":
                borrar_todo.style.display = "inline-block";
            break;
            case "marcar":
                marcar.setAttribute("data-estado","todos");
            break;
        }
    }

    function propiedades_elementos_checkbox_marcados(accion,elemento){
        switch(accion){
            case "renglon":
                elemento.setAttribute("data-name","0")
            break;
            case "checkbox":
                elemento.className = "js_alinear_items js_checkbox";
            break;
            case "tarea":
                elemento.style.textDecoration = "none";
            break;
            case "marcar":
                marcar.setAttribute("data-estado","ninguno");
            break;
            case "borrar_todo":
                borrar_todo.style.display = elemento;
            break;
        }
    }
   
    function propiedades_elementos_contador(accion,elemento){
            switch(accion){
            case "barra_inferior":
                barra_inferior.style.display = elemento;
            break;
            case "marcar":
                marcar.setAttribute("data-estado",elemento);
            break;
        }
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
                asignar_propiedades("checkbox_sinmarcar","renglon",renglon);
                asignar_propiedades("checkbox_sinmarcar","checkbox",checkbox);
                asignar_propiedades("checkbox_sinmarcar","tarea",tarea);
                asignar_propiedades("checkbox_sinmarcar","borrar_todo");
                
                renglones_marcados = renglones_line_through();
                if (renglones_marcados === lista.children.length){
                    asignar_propiedades("checkbox_sinmarcar","marcar");
                    debeMarcar=false;
                }
                actualizar_contador(false);
            }
            else{
                asignar_propiedades("checkbox_marcados","renglon",renglon);
                asignar_propiedades("checkbox_marcados","checkbox",checkbox);
                asignar_propiedades("checkbox_marcados","tarea",tarea);
                asignar_propiedades("checkbox_marcados","marcar");
                debeMarcar=true;
                              
                renglones_marcados = renglones_line_through();
                renglones_marcados !== 0 ? asignar_propiedades("checkbox_marcados","borrar_todo","inline-block") : asignar_propiedades("checkbox_marcados","borrar_todo","none");
                actualizar_contador(true);
            }
        });
    }

    function renglones_line_through(){
        let count =0;
        for (let i of lista.children){
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
            contador.innerText = numero + numero_tareas;
            asignar_propiedades("contador","barra_inferior","block");
            asignar_propiedades("contador","marcar","ninguno");
        }
        else{
            contador.innerText = numero - 1;
            if (lista.children.length === 0){
                asignar_propiedades("contador","barra_inferior","none");
                asignar_propiedades("contador","marcar","ninguno");
            }
            if (contador.innerText === "0"){
                asignar_propiedades("contador","marcar","todos");
            }
        }
    }

    function insertar_tarea(input_texto){
        let tareas = [{nombre: input_texto.value}];
        if (tareas[0].nombre !== ""){
            mostrar_tareas_pantalla(tareas);
        }
        input_texto.value = "";
    }

    document.addEventListener("DOMContentLoaded", init);

}());