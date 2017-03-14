/*
    The map class parses a map file and oversees deciding spawn locations
    as well as overseeing the rail based movement system.

    the map is not loaded in the constructor so that it is easy to change maps between rounds

    This class takes a TILED map json file
    the following layers are parsed:
        -tracks

    a given tile id is mapped to a list showing what options are available
    for take coming from North East West South (NEWS) either [left,straight,right]

    TODO:
        -add spawns layer
        -should maybe be more robust

*/

const path = require('path')

// Constructor
function Gmap () {
  this.map_name = undefined
  this.data = undefined
  this.height = undefined
  this.width = undefined

  this.spawns = undefined // TODO
}

// public variables

// there are likely mistakes in this since I did it by hand
// ORDERED in N E S  W
var tileGraphDict = {

  0: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], // TODO figure out a solution to account for off rail movement

  1069: [0, [0, 1, 0], 0, [0, 1, 0]], // straight horinzontal
  1126: [[0, 1, 0], 0, [0, 1, 0], 0], // straight vertical

  1068: [[1, 0, 0], [0, 0, 1], 0, 0], // corner S-W
  1067: [[0, 0, 1], 0, 0, [1, 0, 0]], // corner S-e
  1125: [0, [1, 0, 0], [0, 0, 1], 0], // corner N-W
  1124: [0, 0, [1, 0, 0], [0, 0, 1]], // corner N-e

  1072: [[1, 0, 0], [0, 1, 1], 0, [0, 1, 0]], // horizontal with corner S-W
  1071: [[0, 0, 1], [0, 1, 0], 0, [1, 1, 0]], // horizontal with corner S-e
  1129: [0, [1, 1, 0], [0, 0, 1], [0, 1, 0]], // horizontal with corner N-W
  1128: [0, [0, 1, 0], [1, 0, 0], [0, 1, 1]], // horizontal with corner N-e

  1186: [[1, 1, 0], [0, 0, 1], [0, 1, 0], 0], // vertical with corner S-W
  1185: [[0, 1, 1], 0, [0, 1, 0], [1, 0, 0]], // vertical with corner S-e
  1243: [[0, 1, 0], [1, 0, 0], [0, 1, 1], 0], // vertical with corner N-W
  1242: [[0, 1, 0], 0, [1, 1, 0], [0, 0, 1]], // vertical with corner N-e

  1299: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]] // crossroads
}

var headingsToVector = {
  0: [0, -1], // north
  1: [1, 0], // east
  2: [0, 1], // south
  3: [-1, 0] // west
}

var startPoint = {
    // where to start turn arcs on the tile
  0: [0.5, 1],       // north
  1: [0, 0.5],       // east
  2: [0.5, 0],       // south
  3: [1, 0.5]       // west
}

// Currently unused
// var turnOperation = {
//     // - or + based on whether the turn path is coming from begining or end of tile
//   0: -1,       // north
//   1: 1,       // east
//   2: 1,       // south
//   3: -1       // west

// }

var headingToAngle = {
  0: 270,       // north
  1: 0,       // east
  2: 90,       // south
  3: 180       // west
}

// class methods
Gmap.prototype.load = function (mapJsonName) {
    // load and parse a mapJson file
  this.map_name = mapJsonName

  const mapJson = require(path.resolve(__dirname, '..', 'maps', mapJsonName)) // TODO make this more robust
  this.width = mapJson['width']
  this.height = mapJson['height']

  for (var i = 0, len = mapJson['layers'].length; i < len; i++) {
    if (mapJson['layers'][i]['name'] === 'tracks') {
      console.log('found!')
      this.data = mapJson['layers'][i]['data']
    }
  }
}

Gmap.prototype.spawn_location = function (player, team = 0) {
    // spawn the player at a spawn point according to their team
    // TODO
  player.x = 33.5
  player.y = 9.5
  player.heading = 1
  player.last_heading = 1
}

Gmap.prototype.move = function (player) {
    // handle player movement
    // console.log(player.x,player.y);

    // keep the player in bounds
  if (player.x < 0) player.x = 0
  if (player.x > this.width)player.x = this.width - 0.2
  if (player.y < 0) player.y = 0
  if (player.y > this.height)player.y = this.height - 0.2

  let tileX = Math.floor(player.x)
  let tileY = Math.floor(player.y)

  let heading = player.heading
  let turning = player.turning
  let speed = Math.abs(player.speed)
  if (player.speed < 0) {
    heading = (heading + 2) % 4
    turning = 1 // cant turn in reverse
  }

  let playerTile = this.data[tileY * this.width + tileX % this.width]
  if (playerTile !== 0)playerTile--//  due to the first gid in the tiled format, this could break with multiple tilesets TODO make robust

  const validMoves = tileGraphDict[playerTile]
  if (validMoves === undefined) {
    console.log('WARNING undefined tile in map_class.js, ' + playerTile + ', at coords: ' + tileX + ',' + tileY)
    console.log(player.x, player.y)
  }

  if (player.midturn === 0) {
        // check to see if a turn should be initiated
        // console.log(player.heading,player.turning);
        // console.log(validMoves);

    if (turning !== 1 && validMoves[heading][turning]) {
            // the player wants to turn and can
      player.midturn = turning - 1
      console.log('turn initiated by press!')
    }
    if (!validMoves[heading][1]) {
            // the player wants to go straight and can't
      player.midturn = validMoves[heading].indexOf(1) - 1
      console.log('turn initiated by necessity!')
    }
  }

    // set player angle for aesthetic purposes
  player.angle = (headingToAngle[player.heading] + player.midturn * 90 * player.progress + 360) % 360

    // advance the player through the section
  player.progress += speed

  if (player.midturn === 0) {
        // go straight
        // console.log("straight!");

        // player.angle=headingToAngle[player.heading];

        // this causes the player to stutter when going north or west...

    player.x = tileX + startPoint[heading][0] + player.progress * headingsToVector[heading][0]
    player.y = tileY + startPoint[heading][1] + player.progress * headingsToVector[heading][1]

        /*
        direction= headingsToVector[heading];
        player.x+=direction[0]*speed;
        player.y+=direction[1]*speed;
        */
  } else {
        // turn
        // console.log("turning!");
        // a turn is only 80% the length as going straight, for now we'll still make it take 100% of the time for simplicity
    player.x = tileX + startPoint[heading][0] + player.progress * 0.5 * (headingsToVector[heading][0] + headingsToVector[(heading + player.midturn + 4) % 4][0])// the +4 is bc js modulo sucks
    player.y = tileY + startPoint[heading][1] + player.progress * 0.5 * (headingsToVector[heading][1] + headingsToVector[(heading + player.midturn + 4) % 4][1])
        /*
        player.x= tileX +startPoint[heading][0] + 0.5*Math.sin((0.8/player.progress)*Math.PI*0.5*(-1)*player.midturn + (heading-1)*Math.PI*0.5);
        player.y= tileY +startPoint[heading][1]+ 0.5*Math.cos((0.8/player.progress)*Math.PI*0.5*(-1)*player.midturn + (heading-1)*Math.PI*0.5);
        */
  }

  if (player.progress > 1) {
        // store info for next car and reset car state

    if (player.attached_front === undefined) {
      player.progress = 0 // TODO we should bank the extra distance right?
    } else {
            // sync the car up with the rest of the train? TODO make this legit
      player.progress = player.attached_front.progress
    }

    player.last_turn = player.midturn + 1
    player.last_heading = player.heading
    player.heading = (player.heading + player.midturn + 4) % 4// important to turn the train!
    player.midturn = 0 // important to end the turn! ...... after you change the heading lol
        // console.log("turn complete!");
  } else if (player.midturn !== 0) {
        // don't exit tile by a rounding error on a turn
        // console.log(player.x,player.y);

    player.x = Math.min(Math.max(tileX, player.x), tileX + 0.999)
    player.y = Math.min(Math.max(tileY, player.y), tileY + 0.999)
  }
}

module.exports = Gmap
