/*
    This file contains the game_loop which at the moment oversees paint opperations
    Also deals with player camera
    TODO:
        -should painting and game logic be seperated? -andrew
*/

GAME_INITIALIZED = 0
game_init = function () {
    // initialization is wrapped in this function so that the variables can be initializes once evertyhing is already loaded
  window.PLAYER_CAMERA = {
    'x': 0,
    'y': 0,
    'h': bgCanvas.height / RESOLUTION,
    'w': bgCanvas.width / RESOLUTION
  }

  window.SNAP_BUFFER = []
  window.PROJECTILES= []
  GAME_INITIALIZED = 1
}

parse_snapshot = function (data) {
    // parse the snapshot and put it into the snapshot buffer
    // console.log("parsing snapshot!");
  decoded = getSnapshot(data)
    // console.log(data);
    // console.log(decoded);
  SNAP_BUFFER.unshift(decoded) // unshift prepends the value to the front of the list

    // remove the last value if the buffer is sufficiently long
    // TODO would it be worth it to start the buffer with 0s instead of checking length or does it really not make a big diff?
  if (SNAP_BUFFER.length > BUFFER_LENGTH) SNAP_BUFFER.splice(-1, 1)
}

parse_events = function(events){
  // parse the various events, event can't be skipped
  parsedEvents= getEvents(events)
  for(var i =0, len= parsedEvents.shots.length; i<len;i++){
    //console.log(parsedEvents.shots[i]);
    PROJECTILES.push(parsedEvents.shots[i]);
  }
}

window.requestAnimId = 0
window.GAME_LOOP_COUNTER = 0// so that we don't print to console like nuts
game_loop = function () {
    // The game loop is called every time the browser refreshes the screen,
    // this method is efficent since it won't be called when the tab is not in focus
    // and it syncs with screen paint actions so that the scene is rendered halfway through our updates
  GAME_LOOP_COUNTER = (GAME_LOOP_COUNTER + 1) % 10000
  requestAnimId = window.requestAnimationFrame(game_loop)
  client_time = (new Date() - LERP) % 86400000 // does it matter if this is called before or after requestAnimationFrame?

  if (SNAP_BUFFER.length == 0) {
    console.log('buffer empty, waiting for first snapshot')
    return
  }
    // console.log(client_time - SNAP_BUFFER[0].timestamp);
  interpolated_snap = {}

  interpolate(client_time, interpolated_snap)

  draw_screen(interpolated_snap,client_time)

    // send key inputs to the server
  inputHandler.send()
}

draw_screen = function (snapshot,client_time) {
    // all actual painting to canvas should be called from this function
    // console.log(snapshot);
  setCameraPosition(snapshot)

  ctx = fgCanvas.getContext('2d')
  ctx.clearRect(0, 0, fgCanvas.width, fgCanvas.height)
  
  draw_ugly_trains(ctx, snapshot)
  draw_projectiles(ctx,client_time)
  draw_map()
}

draw_map = function () {
    // painting of the map should be handled here
    // TODO: increase efficiency by pre rendering a slightly larger map and translating it instead of redrawing each frame
  ctx = bgCanvas.getContext('2d')
  gMap.draw(ctx)
}

draw_projectiles = function(ctx,client_time){
  //for now these are drawn on the same canvas as the trains
  for(var i=PROJECTILES.length -1 ; i>=0 ; i--){
    // loop in reverse since we will delete items from the list
    console.log()
    if(PROJECTILES[i].speed* (client_time-PROJECTILES[i].timestamp )/1000 > PROJECTILES[i].range){
      //the projectile has expired so remove it from the list
      PROJECTILES.splice(i, 1);
      console.log("pew pew expired")
    }else{
      //figure out where to draw the bullet
      x= PROJECTILES[i].x + PROJECTILES[i].dir.x * PROJECTILES[i].speed* (client_time-PROJECTILES[i].timestamp )/1000
      y= PROJECTILES[i].y + PROJECTILES[i].dir.y * PROJECTILES[i].speed* (client_time-PROJECTILES[i].timestamp)/1000
      draw_bullet(ctx,x,y)
    }
    
  }

}

draw_bullet = function(ctx,x,y){
  console.log("draw pew pew at", x, y);

  screenCoords= game_coords_to_screen(x,y)
  ctx.fillStyle="#FF0000";
  console.log("draw pew pew at screen", screenCoords[0], screenCoords[1]);
  ctx.fillRect(screenCoords[0]-1 ,screenCoords[1]-1,3,3);
  ctx.stroke();
}

window.onresize = resize = function () {
    /* it's important to decouple resolution from screen size,
    in sumoti.me I didn't do that so zooming out changed the view port and
    the now extra HD canvas could crash your computer( 8k resolution is a lot for chrome to run at 60fps)
    */
  bgCanvas.style.width = window.innerWidth
  bgCanvas.style.height = window.innerHeight
  fgCanvas.style.width = window.innerWidth
  fgCanvas.style.height = window.innerHeight
}

interpolate = function (time, interpolated_snap) {
    // modifies the interpolated_snap which is a passed reference
    // calculates all the interpolated player positions

    // TODO this needs to be evaluated for innefficiencies and bugs
  var before
  var after

    // find the last frame before the given time
    // this will be the first snapshot where the timestamp < time
    // since the stamps are descending
  for (var i = 0, len = SNAP_BUFFER.length; i < len; i++) {
    if (SNAP_BUFFER[i].timestamp < time) {
      before = SNAP_BUFFER[i]
      break
    }
  }

    // find the first frame after the given time
    // this will be the first snapshot where the timestamp > time
    // as we reverse through the list since the stamps are originally descending
  for (var i = SNAP_BUFFER.length - 1, len = SNAP_BUFFER.length; i >= 0; i--) {
    if (SNAP_BUFFER[i].timestamp > time) {
      after = SNAP_BUFFER[i]
      break
    }
  }

    // the time is too far behind the buffer
    // this is likely a clock sync issue
  if (before === undefined) {
    if (GAME_LOOP_COUNTER % 120 == 0)console.log('WARNING before undefined')

    interpolated_snap.players = SNAP_BUFFER[0].players
    return
  }

    // the time is too far ahead of the buffer
    // this could be lag or clock sync if ridiculously huge
  if (after === undefined) {
    if (GAME_LOOP_COUNTER % 120 == 0)console.log('WARNING after undefined')
    interpolated_snap.players = SNAP_BUFFER[0].players
    return
  }

    // TODO this is an absolute pain since I can't send a object and have to send a list...

  after_ids = []
  for (var i = 0, len = after.players.length; i < len; i++) {
    after_ids.push(after.players[i].id)
  }
  before_ids = []
  for (var i = 0, len = before.players.length; i < len; i++) {
    before_ids.push(before.players[i].id)
  }

    // calculate the interpolation weights based on simple linear interpolation
  weight_b = (after['timestamp'] - time) / (after['timestamp'] - before['timestamp'])
  weight_a = (time - before['timestamp']) / (after['timestamp'] - before['timestamp'])

  interpolated_snap.players = []

    // only show id that are in both since it's easier and theres no need to show ids only in one since it's just one frame
  for (var i = 0, len = after_ids.length; i < len; i++) {
        // find where the player is in the before snap
    before_index = before_ids.indexOf(after_ids[i])
        // skip this id if it's not in the before snap
    if (before_index == -1) continue

    player_a = after.players[i]
    player_b = before.players[before_index]

    player = {}
    player.username = player_a.username // TODO is there a better way to do this?
    player.id = player_a.id
    player.cars = []

    for (var j = 0, len_j = Math.min(player_b.cars.length, player_a.cars.length); j < len_j; j++) {
      car = {}
      interpolate_coords(car, player_a.cars[j], player_b.cars[j], weight_a, weight_b)
      car.type = player_b.cars[j].type
      player.cars.push(car)
    }

        // append the interpolated player to the list of players
    interpolated_snap.players.push(player)
  }
}

interpolate_coords = function (result, object_a, object_b, weight_a, weight_b) {
    // stores interpolated coords in the result object
    // calculate the interpolated values
  result.x = weighted_average(object_a.x, object_b.x, weight_a, weight_b)
  result.y = weighted_average(object_a.y, object_b.y, weight_a, weight_b)

  if (Math.abs(object_a.angle - object_b.angle) > 100) {
        // crossing the modula boundary TODO make this better
    result.angle = object_a.angle
  } else {
    result.angle = weighted_average(object_a.angle, object_b.angle, weight_a, weight_b)
  }
}

window.onkeypress = game_onkeypress = function (e) {
    // this is a temporary function meant to test the graphics/stuff without any game logic

    // speed=0.25;
  if (e.charCode === 97) {
        // PLAYER_CAMERA.x-=speed;
  } else if (e.charCode === 100) {
        // PLAYER_CAMERA.x+=speed;
  } else if (e.charCode === 119) {
        // PLAYER_CAMERA.y-=speed;
  } else if (e.charCode === 115) {
        // PLAYER_CAMERA.y+=speed;
  } else if (e.charCode === 101) { // clockwise turn e
    playSound('assets/audio/vapsquad_yellyguy_arena_round_start.wav')
        // ANGLE= (ANGLE +10)%360;
  } else if (e.charCode === 113) { // counter q
       // inputHandler.send();
       // ANGLE= (ANGLE -10)%360;
  }
}

setCameraPosition = function (snapshot) {
    // set the player's camera to center on their train
  var player
  for (var i = 0, len = snapshot.players.length; i < len; i++) {
    if (snapshot.players[i].id == PLAYER_ID) {
      player = snapshot.players[i]
      break
    }
  }
  if (player === undefined) return

  PLAYER_CAMERA.x = Math.min(Math.max(MAP_WIDTH - PLAYER_CAMERA.w, 0), Math.max(player.cars[0].x / 100 - PLAYER_CAMERA.w / 2, 0))
  PLAYER_CAMERA.y = Math.min(Math.max(MAP_HEIGHT - PLAYER_CAMERA.h, 0), Math.max(player.cars[0].y / 100 - PLAYER_CAMERA.h / 2, 0))
    // console.log(PLAYER_CAMERA.x,PLAYER_CAMERA.y);
}
