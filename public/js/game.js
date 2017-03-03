

GAME_INITIALIZED=0;
game_init= function(){
    // initialization is wrapped in this function so that the variables can be initializes once evertyhing is already loaded
    window.PLAYER_CAMERA={
        "x":0,
        "y":0,
        "h":bgCanvas.height,
        "w":bgCanvas.width,
    };
}





window.requestAnimId=0;
game_loop= function(){
    requestAnimId=window.requestAnimationFrame(game_loop);


    draw_screen();

};

draw_screen = function(){
    ctx=fgCanvas.getContext("2d");
    ctx.clearRect(0, 0,fgCanvas.width, fgCanvas.height);
    draw_ugly_train(ctx);
    draw_map();
};

draw_map = function(){
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

ANGLE=0;
window.onkeypress =game_onkeypress = function(e){
    speed=4;
    console.log(PLAYER_CAMERA,e.charCode);
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
        ANGLE= (ANGLE -10)%360;
    }
    
};