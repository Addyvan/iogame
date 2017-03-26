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
    // -----------------------------
  setup: function () {
    inputHandler.bind(87, 'up')
    inputHandler.bind(65, 'left')
    inputHandler.bind(83, 'down')
    inputHandler.bind(68, 'right')
    inputHandler.bind("click", 'click') // figure out if theres a better way to do this
  },

  activate: function (on = true) {
        // used to turn input handling on or off depending on whether the player is in game
    if (on) {
      console.log('input handler active')
      document.addEventListener('keydown', inputHandler.onKeyDown)
      document.addEventListener('keyup', inputHandler.onKeyUp)
      document.addEventListener('mousedown', inputHandler.onMouseDown)
      document.addEventListener('mouseup', inputHandler.onMouseUp)
      document.addEventListener('mousemove', inputHandler.onMouseMove)
    } else {
      console.log('input handler inactive')
      document.removeEventListener('keydown', inputHandler.onKeyDown)
      document.removeEventListener('keyup', inputHandler.onKeyUp)
      document.removeEventListener('mousedown', inputHandler.onMouseDown)
      document.removeEventListener('mouseup', inputHandler.onMouseUp)
      document.removeEventListener('mousemove', inputHandler.onMouseMove)
    }
  },
    // -----------------------------
  onKeyDown: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to true.
    var action = inputHandler.bindings[event.keyCode]
    if (action) {
      inputHandler.actions[action] = 1
    }
  },

    // -----------------------------
  onKeyUp: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to false.

    var action = inputHandler.bindings[event.keyCode]

    if (action) {
      inputHandler.actions[action] = 0
    }
  },

  onMouseDown: function(event){
    var action = inputHandler.bindings['click']
    if (action) {
      inputHandler.actions[action] = 1
    }
  },

  onMouseUp: function(event){
    var action = inputHandler.bindings['click']
    if (action) {
      inputHandler.actions[action] = 0
    }
  },

  onMouseMove : function(event){
    inputHandler.mouse.x=event.clientX
    inputHandler.mouse.y=event.clientY
  },

  bind: function (key, action) {
        // bind a key to an action
    inputHandler.bindings[key] = action
    inputHandler.actions[action] = 0// so that the value is initialized
  },

  send: function () {
        // convert inputs to a list of 0s and 1s to save bandwidth
        // todo: just do it this way to begin...
    inputs = {actions:[], 
            mouse:{x:undefined,y:undefined}};
      
    for (var i = 0; i < INPUT_ORDER.length; i++) {
      if(TEXT_MODE){//TEXT_MODE is controlled in the ui-controls.js file
        // send false for all since the player is typing a message
        inputs.actions.push(0)
      }
      else{
        inputs.actions.push(inputHandler.actions[INPUT_ORDER[i]])
      }
      
    }
    // do the mouse coord here to avoid issues with scrolling camera and stationary mouse
    game_coords= screen_coords_to_game(inputHandler.mouse.x,inputHandler.mouse.y);
    inputs.mouse.x=game_coords[0]
    inputs.mouse.y=game_coords[1]

    //console.log(inputs.mouse);
    binary_inputs = set(inputs)
    //console.log(inputs);
        // console.log(binary_input_list);
    socket.emit('a', binary_inputs)
  }

})
