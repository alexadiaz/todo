//(function(){

    // -------- Data Manipulation

    var model = {
        taskList: [ ],
        viewType: ""
    };

    function d_startup() {
        model.viewType = "ALL";
    }

    function d_addTask(taskName){
        var newTask = { 
            text: taskName, 
            isDone: false 
        }; 
        model.taskList.push( newTask );
    }

    function d_getList(){
        var list = [];
        for(var element of model.taskList){
            list.push(element);
        }
        return list;
    }

    function d_getNumberPendingTasks(){
        var total = 0;
        for(var item of model.taskList){
            if(item.isDone === false){
                total++;
            }
        }
        return total;
    }

    // ----------============

    
    
    
    // --------- HTML Manipulation

    function h_onEnterInElement(element, fn){
        element.onkeypress = function(oKeyEvent){
            if(oKeyEvent.key === "Enter"){
                fn(oKeyEvent.target.value);
            }
        };
    }

    function h_clearText(element){
        element.value = "";
    }

    function h_onInit(fn){
        document.addEventListener("DOMContentLoaded", fn);
    }

    function h_getById(id){
        return document.getElementById(id);
    };

    function h_deleteChildren(element){
        var list = element.children;
        for (var i = list.length - 1; i >= 0; i--){
            element.removeChild(list[i]);
        }
    }

    function h_addChildrenToList(element, list){
        for(var child of list){
            var newElement = document.createElement("li");
            newElement.innerText = child.text;
            element.appendChild(newElement);
        }
    }

    function h_showElement(element){
        element.style.display = "inline-block";
    }

    function h_setText(element, text){
        element.innerText = text;
    }


    // ----------============



    // -------------- App TODO

    h_onInit(function(){

        // elements
        var newTaskElement = h_getById("texto");
        var listElement = h_getById("lista");
        var bottomBarElement = h_getById("letra");
        var counterElement = h_getById("contador");
        
        // setup data
        d_startup();


        // wiring (encajarlas)
        h_onEnterInElement(newTaskElement, function(taskName){
            
            d_addTask(taskName);
            h_clearText(newTaskElement);
            
            h_deleteChildren(listElement);
            h_addChildrenToList(listElement, d_getList());

            h_showElement(bottomBarElement);

            h_setText(counterElement, d_getNumberPendingTasks());

        });


    });


    // ----------============

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

        texto.onkeypress = function(oKeyEvent){
            if(oKeyEvent.charCode === 13){
                agregar(this);
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
        
        var text ="";
        text =textoElement.value;

        if (text  != "") {

            var nuevoMarcarElement= document.createElement("input");
            nuevoMarcarElement.type="checkbox";
            nuevoMarcarElement.className="js_alinear_items js_checkbox"
            nuevoMarcarElement.addEventListener("click",function(){
                
                var ul= document.getElementById("lista");
                var borrar = document.getElementById("borrar-todo");
                var lis = ul.children;
                var debeMarcar = null;
                var count =0;

                if (nuevoDivElement.style.textDecoration != "line-through"){
                    nuevoDivElement.style.textDecoration = "line-through"
                    nuevoLiElement.setAttribute("name", "1");
                    nuevoMarcarElement.className= "js_alinear_items js_checkbox_marcado";
                    borrar.style.display="inline-block";

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


            var nuevoDivElement= document.createElement("div");
            nuevoDivElement.innerText= text ;
            nuevoDivElement.className="js_alinear_items js_margen_items";


            var nuevoInputElement= document.createElement("input");
            nuevoInputElement.type="button";
            nuevoInputElement.value="x";
            nuevoInputElement.className="botones js_boton_eliminar";
            nuevoInputElement.style.display = "none";
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


        function mostrar_ocultar (li,is_mostrar){
                var display = is_mostrar===true ? "inline-block" : "none";
                var el = li.querySelector(".js_boton_eliminar")
                el.style.display = display;
            }


            var nuevoLiElement = document.createElement("li");
            nuevoLiElement.addEventListener("mouseover", function(){
                mostrar_ocultar (this,true);
            });

            nuevoLiElement.addEventListener("mouseleave", function(){
                mostrar_ocultar (this,false);
            });

            nuevoLiElement.appendChild(nuevoMarcarElement);
            nuevoLiElement.appendChild(nuevoDivElement);
            nuevoLiElement.appendChild(nuevoInputElement);
            
            nuevoLiElement.className="linea_renglon";

            var ulElement = document.getElementById("lista");
            ulElement.appendChild(nuevoLiElement);
            
            contador(true);
        
            textoElement.value="";
        }    
    }

    function contador (operador){
        
        var mostrar = document.getElementById("contador");
        var numero = Number(mostrar.innerText);
        var letra = document.getElementById("letra");
        var marcar = document.getElementById("marcar");
        var borrar =document.getElementById("borrar-todo");

        if (operador === true){
            mostrar.innerText=numero+1;
            letra.style.display="block";
            marcar.setAttribute("data-estado", "ninguno");
        }
        else{
            mostrar.innerText=numero-1;
            var ul= document.getElementById("lista");
            if(ul.children.length === 0){
                letra.style.display="none";
                marcar.setAttribute("data-estado", "ninguno");
            }
            if (mostrar.innerText==="0"){
                marcar.setAttribute("data-estado","todos");
            }
        }
    }

    //document.addEventListener("DOMContentLoaded", init);

//}());
