/*
    This file is temporary and experimental
*/
SCALE=3; 

UGLY_LOADED=0;

load_ugly_sprite = function(){
    window.ugly_train_img= new Image();
    ugly_train_img.onload= function(){UGLY_LOADED=1;};
    ugly_train_img.src= "/assets/" + "uglytrain.png";
};

draw_ugly_trains= function(ctx,snapshot){

    for(var i=0, len=snapshot.players.length;i<len; i++ ){
        //TODO find a nicer way to do this succintly
        //console.log(snapshot.players[i].x,snapshot.players[i].y);
        game_coords= game_coords_to_screen(snapshot.players[i].x,snapshot.players[i].y) ;
        px=game_coords[0];
        py=game_coords[1];
        //console.log(px,py);
        draw_ugly_train(ctx,px,py,snapshot.players[i].angle);
    }

    
    //draw_ugly_train(ctx, PLAYER_CAMERA.w/4,PLAYER_CAMERA.h/4,0);
    //draw_ugly_train(ctx,px,py,ANGLE);

};

draw_ugly_train  = function(ctx,px,py,angle){
    // we save the context settings, apply rotation, draw then revert the transformations so that the next draw is normal
    if(!UGLY_LOADED) return;
    ctx.save()
    ctx.translate((px  )*SCALE, (py  )*SCALE);
    ctx.rotate(angle * Math.PI / 180);

    for (var i =0; i<16;i++){
        ctx.drawImage(ugly_train_img, i*16 , 0,
                        16, 16,
                        -8*SCALE-Math.sin(angle* Math.PI / 180)*i*SCALE,-8*SCALE-Math.cos(angle* Math.PI / 180)*i*SCALE,
                        16*SCALE,16*SCALE);
    }
    ctx.restore();
};