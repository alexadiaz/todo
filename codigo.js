(function(){

    var negros = null;
    var rojos = null;
    var todos = null; 

    function init() {
        
        var texto = document.getElementById("texto");
        var borrar_todo= document.getElementById("borrar-todo");
        negros = document.getElementById("negros");
        rojos =  document.getElementById("rojos");
        todos = document.getElementById("todos"); 
        marcar = document.getElementById("marcar");

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
        var lista = id_elemento("lista");
        for (let i in tareas){
            let nombre_tarea = tareas[i].nombre;
            
            let renglon = crear_elemento("li");
            let checkbox = crear_elemento("input");
            let tarea = crear_elemento("div");
            let eliminar = crear_elemento("input");
            
            asignar_propiedades_elemento(renglon,"renglon");
            asignar_propiedades_elemento(checkbox,"checkbox");
            asignar_propiedades_elemento(tarea,"tarea",nombre_tarea);
            asignar_propiedades_elemento(eliminar,"eliminar");

            asignar_eventos_renglon(renglon);
            
            lista.appendChild(renglon);
            renglon.appendChild(checkbox);
            renglon.appendChild(tarea);
            renglon.appendChild(eliminar);
        }
    }

    function id_elemento(id){
        return document.getElementById(id);
    }

    function crear_elemento(elemento){
        return document.createElement(elemento);
    }
   
    function asignar_propiedades_elemento(elemento,accion,nombre_tarea){
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

    function asignar_eventos_renglon(renglon){
        renglon.addEventListener("mouseover", () => mostrar_ocultar(renglon,true));
        renglon.addEventListener("mouseleave", () => mostrar_ocultar(renglon,false));
    }

    function mostrar_ocultar (renglon,is_mostrar){
        let display = is_mostrar === true ? "inline-block" : "none";
        let eliminar = renglon.querySelector(".js_boton_eliminar")
        eliminar.style.display = display;
    }

    function insertar_tarea(input_texto){
        let tareas = [{nombre: input_texto.value}];
        if (tareas[0].nombre !== ""){
            mostrar_tareas_pantalla(tareas);
        }
    }

    document.addEventListener("DOMContentLoaded", init);

}());