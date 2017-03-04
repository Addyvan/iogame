/*
    Code lifted from udacity course but significantly modified

    There should only be one instance of this class and it must be called
    inputHandler , currently thes classes dont seem to support self referencing...

    apparently init is reserved and called automatically so that's why setup is named as such
*/

InputHandlerClass = Class.extend({

    // A dictionary mapping ASCII key codes to string values
    // describing the action we want to take when that key is
    // pressed.
    bindings: {},

    // A dictionary mapping actions that might be taken in our
    // game to a boolean value indicating whether that action
    // is currently being performed.
    actions: {},

    mouse: {
        x: 0,
        y: 0
    },
    //-----------------------------
    setup: function (){
        inputHandler.bind(87, 'up');
        inputHandler.bind(65, 'left');
        inputHandler.bind(83, 'down');
        inputHandler.bind(68, 'right');
    },

    activate: function(on=true){
        // used to turn input handling on or off depending on whether the player is in game
        if(on){
            console.log("input handler active");
            document.addEventListener("keydown",inputHandler.onKeyDown);
            document.addEventListener("keyup",inputHandler.onKeyUp);
        }
        else{
            console.log("input handler inactive");
            document.removeEventListener("keydown",inputHandler.onKeyDown);
            document.removeEventListener("keyup",inputHandler.onKeyUp);
        }
    },
    //-----------------------------
    onKeyDown: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to true.
        var action = inputHandler.bindings[event.keyCode];
        if (action) {
            inputHandler.actions[action] = 1;
        }
    },

    //-----------------------------
    onKeyUp: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to false.

        var action = inputHandler.bindings[event.keyCode];

        if (action) {
            inputHandler.actions[action] = 0;
        }
    },

    bind: function (key, action) {
        // bind a key to an action
        inputHandler.bindings[key] = action;
        inputHandler.actions[action] = 0;// so that the value is initialized
    },

    send: function(){
        // convert inputs to a list of 0s and 1s to save bandwidth
        // todo: just do it this way to begin...
        input_list=[];
        for(var i=0; i<INPUT_ORDER.length;i++){
            input_list.push(inputHandler.actions[INPUT_ORDER[i]]);
        }
        //console.log(input_list);
        //binary_input_list=set(input_list);
        input_list= {time: 30001,
                    test:[
                            { name:"john",
                                age:13
                            },
                            {age:16,
                                name:"jim"}
                            ]
                        };
        console.log(input_list);
        binary_input_list=set(input_list);                
        console.log(binary_input_list);
        socket.emit('a',binary_input_list);
    }   

});
window.inputHandler= new InputHandlerClass();