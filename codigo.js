//(function(){

    // -------- Data Manipulation

    var model = {
        taskList: [ ],
    };

    function d_startup() {
    }

    function d_addTask(taskName){
        var newTask = { 
            text: taskName, 
            isDone: false 
        }; 
        model.taskList.push( newTask );
    }

    function d_getAllTasks(){
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

    function h_addChildrenToItem(element, children){
        for(var child of children){
            element.appendChild(child);
        }
    }

    function h_showElement(element){
        element.style.display = "inline-block";
    }

    function h_setText(element, text){
        element.innerText = text;
    }

    function h_createElement(tag, attributes){
        var newElement = document.createElement(tag);
        
        for(var key in attributes){
            newElement[key] = attributes[key];
        }

        return newElement;
    }


    // ----------============



    // -------------- App TODO

    h_onInit(function(){

        // elements
        var newTaskElement = h_getById("texto");
        var ulElement = h_getById("lista");
        var bottomBarElement = h_getById("letra");
        var counterElement = h_getById("contador");
        
        // setup data
        d_startup();


        // wiring (encajarlas)
        h_onEnterInElement(newTaskElement, function(taskName){
            
            d_addTask(taskName);
            h_clearText(newTaskElement);
            
            h_deleteChildren(ulElement);

            var allTasks = d_getAllTasks();
            var listOfLIs = buildListItems(allTasks);
            h_addChildrenToItem(ulElement, listOfLIs);

            h_showElement(bottomBarElement);

            h_setText(counterElement, d_getNumberPendingTasks());

        });

        function buildListItems(allTasks){
            
            var allLIs = [];
            
            for(var task of allTasks){
                var attributes = {
                    className: 'linea_renglon', 
                    innerText: task.text
                };
                var li = h_createElement('li', attributes);
                allLIs.push(li);
            }

            return allLIs;
        }


    });
  
//}());
