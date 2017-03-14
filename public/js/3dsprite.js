/*
    This file is temporary and experimental
    todo revamp this
*/

UGLY_LOADED = 0

load_ugly_sprite = function () {
  window.ugly_train_img = new Image()
  ugly_train_img.onload = function () { UGLY_LOADED += 1 }
  ugly_train_img.src = '/assets/' + 'uglytrain.png'

  window.ugly_car_img = new Image()
  ugly_car_img.onload = function () { UGLY_LOADED += 1 }
  ugly_car_img.src = '/assets/' + 'uglycar.png'
}

draw_ugly_trains = function (ctx, snapshot) {
  for (var i = 0, len = snapshot.players.length; i < len; i++) {
        // TODO find a nicer way to do this succintly
        // console.log(snapshot.players[i].x,snapshot.players[i].y);
        // draw cars
        // console.log(snapshot.players[i]);
    for (var j = 0, len_j = snapshot.players[i].cars.length; j < len_j; j++) {
            // console.log("drawing car!");
      car_game_coords = game_coords_to_screen(snapshot.players[i].cars[j].x, snapshot.players[i].cars[j].y)
      car_px = car_game_coords[0]
      car_py = car_game_coords[1]
            // console.log(car_px,car_py);
      if (snapshot.players[i].cars[j].type == 0) {
                // todo this should be some kind of atlas
        car_img = ugly_car_img
      } else if (snapshot.players[i].cars[j].type == 1) {
        car_img = ugly_train_img
      }
      draw_3d(ctx, car_img, car_px, car_py, snapshot.players[i].cars[j].angle)
    }
  }

    // draw_ugly_train(ctx, PLAYER_CAMERA.w/4,PLAYER_CAMERA.h/4,0);
    // draw_ugly_train(ctx,px,py,ANGLE);
}

draw_3d = function (ctx, image, px, py, angle) {
    // we save the context settings, apply rotation, draw then revert the transformations so that the next draw is normal
  if (UGLY_LOADED < 2) return
  ctx.save()
  ctx.translate((px) * SPRITE_SCALE, (py) * SPRITE_SCALE)
  ctx.rotate(angle * Math.PI / 180)

  for (var i = 0; i < 16; i++) {
    ctx.drawImage(image, i * 16, 0,
                        16, 16,
                        -8 * SPRITE_SCALE - Math.sin(angle * Math.PI / 180) * i * SPRITE_SCALE, -8 * SPRITE_SCALE - Math.cos(angle * Math.PI / 180) * i * SPRITE_SCALE,
                        16 * SPRITE_SCALE, 16 * SPRITE_SCALE)
  }
  ctx.restore()
}
