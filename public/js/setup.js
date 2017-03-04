/*
Perform initialization of global variables and load in map/tilesets/spritesheets

*/

function setup(){

    window.bgCanvas= document.getElementById("bg");
    window.fgCanvas= document.getElementById("fg");

    window.bgCanvas.height=VIEWPORT_HEIGHT;
    window.bgCanvas.width=VIEWPORT_WIDTH;
    window.fgCanvas.height=VIEWPORT_HEIGHT*3;
    window.fgCanvas.width=VIEWPORT_WIDTH*3;

    resize(); // run the on resize function so that all the canvases are now the right size

    //initialize the input handler
    window.inputHandler= new InputHandlerClass();
    inputHandler.setup();

    // load/initialize the map and sprites
    window.gMap = new TILEDMapClass();
    gMap.load('/assets/map.json');
    load_ugly_sprite();

    // connect to socket and set event handlers
    connect_to_socket();

    console.log("setup complete!");

    start_game();// this is temporary since there is no button yet
};

function start_game(){
    //starts the game
    if(!GAME_INITIALIZED){
        game_init();
    }
    if (!requestAnimId) {//defined right before game_loop in game.js
       inputHandler.activate();
       game_loop();
    }
};


connect_to_socket= function(type="player"){
    window.socket = io.connect('http://localhost:'+GAME_PORT,{query:"type=" + type});
    socket.on('playerID', function (data) {
       PLAYER_ID=data.id;
    });

    //on snapshot
    socket.on('s',parse_snapshot);
};

