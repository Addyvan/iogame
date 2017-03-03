/*
    This file contains the game_loop which at the moment oversees paint opperations 
    Also deals with player camera
    TODO:
        -should painting and game logic be seperated? -andrew
*/

GAME_INITIALIZED=0;
game_init= function(){
    // initialization is wrapped in this function so that the variables can be initializes once evertyhing is already loaded
    window.PLAYER_CAMERA={
        "x":0,
        "y":0,
        "h":bgCanvas.height,
        "w":bgCanvas.width
    };
    GAME_INITIALIZED=1;
};





window.requestAnimId=0;
game_loop= function(){
    // The game loop is called every time the browser refreshes the screen, 
    // this method is efficent since it won't be called when the tab is not in focus
    // and it syncs with screen paint actions so that the scene is rendered halfway through our updates
    requestAnimId=window.requestAnimationFrame(game_loop);

    

    draw_screen();

};

draw_screen = function(){
    // all actual painting to canvas should be called from this function
    ctx=fgCanvas.getContext("2d");
    ctx.clearRect(0, 0,fgCanvas.width, fgCanvas.height);
    draw_ugly_trains(ctx);
    draw_map();
};

draw_map = function(){
    // painting of the map should be handled here
    // TODO: increase efficiency by pre rendering a slightly larger map and translating it instead of redrawing each frame 
    ctx=  bgCanvas.getContext("2d");
    gMap.draw(ctx);

};


window.onresize =resize= function(){
    /* it's important to decouple resolution from screen size, 
    in sumoti.me I didn't do that so zooming out changed the view port and
    the now extra HD canvas could crash your computer( 8k resolution is a lot for chrome to run at 60fps)
    */
    bgCanvas.style.width = window.innerWidth;
    bgCanvas.style.height = window.innerHeight;
    fgCanvas.style.width = window.innerWidth;
    fgCanvas.style.height = window.innerHeight;

};


window.onkeypress =game_onkeypress = function(e){
    // this is a temporary function meant to test the graphics without any game logic
    speed=4;
    //console.log(PLAYER_CAMERA,e.charCode);
    if (e.charCode === 97) { 
        PLAYER_CAMERA.x-=speed;
    }
    else if (e.charCode === 100) {
        PLAYER_CAMERA.x+=speed;
    }
    else if (e.charCode === 119) {
        PLAYER_CAMERA.y-=speed;
    }
    else if (e.charCode === 115) {
        PLAYER_CAMERA.y+=speed;
    }
    else if(e.charCode === 101) {// clockwise turn e
        ANGLE= (ANGLE +10)%360;
    }
    else if(e.charCode === 113) {//counter q
        inputHandler.send();
        ANGLE= (ANGLE -10)%360;
    }
    
};