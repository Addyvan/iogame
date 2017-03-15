/*
Client side utils

*/

function xhrGet (reqUri, callback, type) {
    // small wrapper to facilitate XMLHttpRequests
  var caller = xhrGet.caller
  var xhr = new XMLHttpRequest()
  xhr.open('GET', reqUri, true)

  if (type) xhr.responseType = type

  xhr.onload = function () {
    if (callback) {
      try {
        callback(xhr)
      } catch (e) {
        throw 'xhrGet failed:\n' + reqUri + '\nException: ' + e + '\n'
      }
    }
  }

  xhr.send()
}

function game_coords_to_screen (x, y, scale = 1) {
    // convert game coordinates to an on screen coordinate
  screen_x = (x / 100 - PLAYER_CAMERA.x) * RESOLUTION * scale
  screen_y = (y / 100 - PLAYER_CAMERA.y) * RESOLUTION * scale
  return [screen_x, screen_y]
}

function screen_coords_to_game (x, y) {
    // convert screen coordinates to a game coordinate
  //console.log(x,y,window.innerWidth,window.innerHeight)
  game_x = Math.floor( ((x /window.innerWidth )* (PLAYER_CAMERA.w) + PLAYER_CAMERA.x) *100)
  game_y = Math.floor(((y /window.innerHeight )* PLAYER_CAMERA.h+ PLAYER_CAMERA.y) *100)
  //console.log([game_x, game_y])
  return [game_x, game_y]
}

function weighted_average (a, b, weight_a, weight_b) {
  return weight_a * a + weight_b * b
}
