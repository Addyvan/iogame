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

    window.gMap = new TILEDMapClass();
    gMap.load('/assets/map.json');
    load_ugly_sprite();

    console.log("setup complete!");

    start_game();
};

function start_game(){
    if(!GAME_INITIALIZED){
        game_init();
    }
    if (!requestAnimId) {//defined right before game_loop in game.js
       game_loop();
    }
};




