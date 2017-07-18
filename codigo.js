var negros = null;
var rojos = null;
var todos = null; 
 
 function init() {
    
    var texto = document.getElementById("texto");
    negros = document.getElementById("negros");
    rojos =  document.getElementById("rojos");
    todos = document.getElementById("todos"); 
    marcar = document.getElementById("marcar");

    texto.onkeypress = function(oKeyEvent){
        if(oKeyEvent.charCode === 13) 
        {
            agregar(this);
        }
    };
 

   marcar.addEventListener("click",function(){

        var ul= document.getElementById("lista");
        var lis = ul.children;
        var div = ul.querySelectorAll("div");
        var input = ul.querySelectorAll("input.alinear");
        var borrar = document.getElementById("borrar-todo");
        var debeMarcar = null;

        if(marcar.getAttribute("data-estado") === "ninguno"){
            debeMarcar = true;
            marcar.setAttribute("data-estado", "todos");
        }    
        else {
            debeMarcar = false;
            marcar.setAttribute("data-estado", "ninguno");
        }

       for (var i=0; i<lis.length;i++){
            
            if(debeMarcar === true) {
                lis[i].setAttribute("name","1");
                div[i].style.textDecoration = "line-through";
                input[i].className="alinear imagen_marcada";
                var mostrar = document.getElementById("contador");
                mostrar.innerText = "0";    
                borrar.style.display="inline-block";
            }
            else {   
                lis[i].setAttribute("name","");
                div[i].style.textDecoration = "none";
                input[i].className="alinear imagen";
                contador(true);
                borrar.style.display="none";
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

    console.log("listos!!!");

}

function foco(r){
    var all= document.getElementById("todos");
    var rojos = document.getElementById("rojos");
    var negros = document.getElementById("negros")

    all.className="botones";
    rojos.className="botones";
    negros.className="botones";

    r.className= r.className + " foco";
}

function agregar(textoElement){
    
    var text ="";
    text =textoElement.value;

    if (text  != "") {

        var nuevoMarcarElement= document.createElement("input");
        nuevoMarcarElement.type="checkbox";
        nuevoMarcarElement.className="alinear imagen"
        nuevoMarcarElement.addEventListener("click",function(){
            
            var ul= document.getElementById("lista");
            var borrar = document.getElementById("borrar-todo");
            var lis = ul.children;
            var debeMarcar = null;
            var count =0;

            if (nuevoDivElement.style.textDecoration != "line-through"){
                nuevoDivElement.style.textDecoration = "line-through"
                nuevoLiElement.setAttribute("name", "1");
                nuevoMarcarElement.className= "alinear imagen_marcada";
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
                nuevoMarcarElement.className= "alinear imagen";
                debeMarcar=true;
                marcar.setAttribute("data-estado","ninguno");
                borrar.style.display="none";
                contador(true);
            }
        });


        var nuevoDivElement= document.createElement("div");
        nuevoDivElement.innerText= text ;
        nuevoDivElement.className="alinear";


        var nuevoInputElement= document.createElement("input");
        nuevoInputElement.type="button";
        nuevoInputElement.value="x";
        nuevoInputElement.className="eliminar";
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
            var el = li.querySelector(".eliminar")
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
        
        nuevoLiElement.className="linea";

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

    if (operador === true){
        mostrar.innerText=numero+1;
        letra.style.display="block";
        
    }
    else{
        mostrar.innerText=numero-1;
        var ul= document.getElementById("lista");
        if(ul.children.length === 0){
            letra.style.display="none";
            marcar = document.getElementById("marcar");
            marcar.setAttribute("data-estado", "ninguno");
        }
    }
}

document.addEventListener("DOMContentLoaded", init);
