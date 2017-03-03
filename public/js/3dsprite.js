UGLY_LOADED=0;

load_ugly_sprite = function(){
    window.ugly_train_img= new Image();
    ugly_train_img.onload= function(){UGLY_LOADED=1;};
    ugly_train_img.src= "/assets/" + "uglytrain.png";
};

draw_ugly_train  = function(ctx){
    if(!UGLY_LOADED) return;
    scale=3;
    px= PLAYER_CAMERA.w/2 ;
    py= PLAYER_CAMERA.h/2 ;
    ctx.save()
    ctx.translate((px + 16 / 2 )*scale, (py + 16 / 2)*scale);
    ctx.rotate(ANGLE * Math.PI / 180);
    /*
    for (var i =0; i<16;i++){
        ctx.drawImage(ugly_train_img, i*16 , 0,
                        16, 16,
                        px,py-i,
                        16,16);
    }
    */
    for (var i =0; i<16;i++){
        ctx.drawImage(ugly_train_img, i*16 , 0,
                        16, 16,
                        -8*scale-Math.sin(ANGLE* Math.PI / 180)*i*scale,-8*scale-Math.cos(ANGLE* Math.PI / 180)*i*scale,
                        16*scale,16*scale);
    }
    ctx.restore();

};