/*
    File for storing client side globals

    Initialization variables should be stored seperately, near the content they relate to.
*/



ANGLE=0;//temporary


//connection
GAME_PORT=3000;
BUFFER_LENGTH=10; // 10*50ms = 0.5 seconds
LERP=100; // render delay in ms

//declarations
var inputHandler;

VIEWPORT_HEIGHT=9*16;
VIEWPORT_WIDTH=16*16;
RESOLUTION=16;

MAP_HEIGHT=30; //Temp
MAP_WIDTH=50;

//input order

INPUT_ORDER=[
    "up",
    "down",
    "left",
    "right"
]


// client info
PLAYER_ID=undefined;