
(function(){
    "use strict";
    var negros = null;
    var rojos = null;
    var todos = null; 

    let lista = null;
    let marcar = null;
    let letra = null;
    let mostrar = null;
    let borrar_todo = null;
    
    function init() {
        
        var texto = document.getElementById("texto");
        //var borrar_todo= document.getElementById("borrar-todo");
        negros = document.getElementById("negros");
        rojos =  document.getElementById("rojos");
        todos = document.getElementById("todos"); 
        //marcar = document.getElementById("marcar");

        lista = id_elemento("lista");
        marcar = id_elemento("marcar");
        letra = id_elemento("letra");
        mostrar = id_elemento("contador");
        borrar_todo = id_elemento("borrar-todo");
        
        consultar_tareas_guardadas();
        
        texto.onkeypress = function(oKeyEvent){
            if(oKeyEvent.charCode === 13){
                insertar_tarea(this);
            }
        };

        marcar.addEventListener("click",function(){

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
                    contador(true);
                }
            }
        });

        borrar_todo.addEventListener("click",function(){
            var ul = document.getElementById("lista");
            var lis =ul.children;

            for (var i = lis.length - 1; i >= 0; i--){
                if (lis[i].getAttribute("name")==="1"){
                    ul.removeChild(lis[i]);
                }
        }
        });

        rojos.addEventListener("click", function(){
            foco(this);
        
            var ul = document.querySelector("#lista");
            var lis = ul.querySelectorAll("li");
            
            for (var i=0; i< lis.length;i++){
                if (lis[i].getAttribute("name")!= "1"){
                    lis[i].style.display="none";
                }
                else{
                    lis[i].style.display="list-item";
                }
            }

        });
        
        negros.addEventListener("click", function(){
            foco(this);

            var nuevoUlElement= document.getElementById("lista");
            var lis = nuevoUlElement.children;
            for (var i=0; i< lis.length;i++){
                if (lis[i].getAttribute("name")=== "1"){
                    lis[i].style.display="none";
                }
                else{
                    lis[i].style.display="list-item";
                }
            }
        });

        todos.addEventListener("click",function(){
            foco(this);

            var nuevoUlElement= document.getElementById("lista");
            var lis= nuevoUlElement.children;
            for (var i=0; i< lis.length;i++){
                lis[i].style.display= "list-item";
            }
        });
    }

    function foco(r){
        var all= document.getElementById("todos");
        var rojos = document.getElementById("rojos");
        var negros = document.getElementById("negros");

        all.classList.remove("foco");
        rojos.classList.remove("foco");
        negros.classList.remove("foco");
        
        r.classList.add("foco");
    }

    function agregar(textoElement){
             
        //boton eliminar
        nuevoInputElement.addEventListener("click",function(){
            var li =this.parentNode;
            var ul = li.parentNode;
        
            if (nuevoDivElement.style.textDecoration !== "line-through"){
                contador(false);
            }
            
            ul.removeChild(li);
            
            if(ul.children.length === 0){
                letra.style.display="none";
                marcar = document.getElementById("marcar");
                marcar.setAttribute("data-estado", "ninguno");
            }
        });
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
            asignar_eventos_checkbox(checkbox,tarea,renglon);
            
            lista.appendChild(renglon);
            renglon.appendChild(checkbox);
            renglon.appendChild(tarea);
            renglon.appendChild(eliminar);
        }
        contador(true,tareas.length);
    }

    function id_elemento(id){
        return document.getElementById(id);
    }

    function crear_elemento(elemento){
        return document.createElement(elemento);
    }

    function asignar_propiedades(funcion,accion,elemento,valor){
        if (funcion === "pantalla"){
            propiedades_elementos_pantalla(accion,elemento,valor);
        }
        else if (funcion === "checkbox"){
            propiedades_elementos_checkbox(accion,elemento,valor);
        }
        else if (funcion === "contador"){
            propiedades_elementos_contador(accion);
        }
    }

    function propiedades_elementos_pantalla(accion,elemento,valor){
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
                elemento.innerText = valor;
            break;
            case "eliminar":
                elemento.className = "botones js_boton_eliminar";
                elemento.type = "button";
                elemento.value = "x";
                elemento.style.display = "none";
            break;
        }
    }

    function propiedades_elementos_checkbox(accion,elemento,valor){
        switch(accion){
            case "renglon":
                elemento.setAttribute("data-name",valor);
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
        }
    }
   
    function propiedades_elementos_contador(accion){
            switch(accion){
            case "letra":
                letra.style.display = "block";
            break;
            case "marcar":
                marcar.setAttribute("data-estado","ninguno");
            break;
        }
    }

    function asignar_eventos_renglon(renglon){
        renglon.addEventListener("mouseover", () => mostrar_ocultar(renglon,true));
        renglon.addEventListener("mouseleave", () => mostrar_ocultar(renglon,false));
    }

    function asignar_eventos_checkbox(checkbox,tarea,renglon){
        checkbox.addEventListener("click",() => {
            let renglones = lista.children;
            let debeMarcar = null;
            let count =0;
            if (tarea.style.textDecoration != "line-through"){
                asignar_propiedades("checkbox","renglon",renglon,"1");
                asignar_propiedades("checkbox","checkbox",checkbox);
                asignar_propiedades("checkbox","tarea",tarea);
                asignar_propiedades("checkbox","borrar_todo");
            

                for (var i=0; i< lis.length;i++){
                    if(lis[i].getAttribute("name")=== "1"){
                        count =count +1;
                    }
                }
                if (count=== lis.length){
                    debeMarcar=false;
                    marcar.setAttribute("data-estado","todos");
                }
                contador(false);
            }
            else{
                nuevoDivElement.style.textDecoration= "none";
                nuevoLiElement.setAttribute("name","0");
                nuevoMarcarElement.className= "js_alinear_items js_checkbox";
                debeMarcar=true;
                marcar.setAttribute("data-estado","ninguno");
                for (var i=0; i< lis.length;i++){
                    if(lis[i].getAttribute("name")=== "1"){
                        count =count +1;
                    }
                }
                if (count!== 0){
                    borrar.style.display="inline-block";
                }
                else{
                    borrar.style.display="none";
                }
                contador(true);
            }
        });
    }

    function mostrar_ocultar (renglon,is_mostrar){
        let display = is_mostrar === true ? "inline-block" : "none";
        let eliminar = renglon.querySelector(".js_boton_eliminar")
        eliminar.style.display = display;
    }

    function contador (operador,numero_tareas){
        let numero = parseInt(mostrar.innerText);
        if (operador){
            mostrar.innerText = numero + numero_tareas;
            asignar_propiedades("contador","letra");
            asignar_propiedades("contador","marcar");
        }
        /*else{
            mostrar.innerText = numero - 1;
            if(lista.children.length === 0){
                asignar_propiedades_elemento(letra,"letra","none");
                asignar_propiedades_elemento(marcar,"marcar","ninguno");
            }
            if (mostrar.innerText === "0"){
                asignar_propiedades_elemento(marcar,"marcar","todos");
            }
        }*/
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