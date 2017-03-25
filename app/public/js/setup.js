/*
Perform initialization of global variables and load in map/tilesets/spritesheets

*/

function setup () {
  window.bgCanvas = document.getElementById('bg')
  window.fgCanvas = document.getElementById('fg')

  window.bgCanvas.height = VIEWPORT_HEIGHT
  window.bgCanvas.width = VIEWPORT_WIDTH
  window.fgCanvas.height = VIEWPORT_HEIGHT * SPRITE_SCALE
  window.fgCanvas.width = VIEWPORT_WIDTH * SPRITE_SCALE

  resize() // run the on resize function so that all the canvases are now the right size

    // initialize the input handler
  window.inputHandler = new InputHandlerClass()
  inputHandler.setup()

    // load/initialize the map and sprites
  window.gMap = new TILEDMapClass()
  gMap.load('/assets/map.json')
  load_ugly_sprite()

  // connect buttons to menu ui functionality
  bind_actions() // in menucontrols.js

    // start audio and begin loading in sounds
  init_audio()

    // connect to socket and set event handlers
  connect_to_socket()

  console.log('setup complete!')

  //start_game()// this is temporary since there is no button yet
};

function start_game () {
  console.log("game starting!")
    // starts the game
  if (!GAME_INITIALIZED) {
    game_init()
  }
  if (!requestAnimId) { // defined right before game_loop in game.js
    inputHandler.activate(true)
    game_loop()
  }
};


function stop_game () {
  // stops the game


  //stop game ui loops (todo make game ui loops)


  //stop the animation/game loop
  if (requestAnimId) {
     window.cancelAnimationFrame(requestAnimId);
     requestAnimId = undefined;
  }

  // stop taking in inputs for the game
  inputHandler.activate(false)

  // empty the snap buffer
  window.SNAP_BUFFER=[];
};

connect_to_socket = function (type = 'player') {
  window.socket = io.connect('http://localhost:' + GAME_PORT, {query: 'type=' + type})
  socket.on('playerID', function (data) {
    PLAYER_ID = data.id
  })

    // on snapshot
  socket.on('s', parse_snapshot)

  //on events
  socket.on('e', parse_events)
}

