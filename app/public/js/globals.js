/*
    File for storing client side globals

    Initialization variables should be stored seperately, near the content they relate to.
*/

ANGLE = 0// temporary

// connection
GAME_PORT = 3000
BUFFER_LENGTH = 10 // 10*50ms = 0.5 seconds
LERP = 100 // render delay in ms

// declarations
var inputHandler
RESOLUTION = 16
VIEWPORT_HEIGHT = 18 * RESOLUTION
VIEWPORT_WIDTH = 32 * RESOLUTION

MAP_HEIGHT = undefined // Temp
MAP_WIDTH = undefined

SPRITE_SCALE = 1
// input order

INPUT_ORDER = [
  'up',
  'down',
  'left',
  'right',
  'click'
]
// round info
ROUND_END=undefined

// client info
PLAYER_ID = undefined
USERNAME=undefined
