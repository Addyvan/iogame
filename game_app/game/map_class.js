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
        -implement a quadtree to handle collision detection and how to send info to clients?

*/

const path = require('path')

// Constructor
function Gmap () {
  this.map_name = undefined
  this.data = undefined
  this.height = undefined
  this.width = undefined
  this.spawns = undefined // TODO

  this.objects= undefined // TODO make a quadtree of map objects
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

Gmap.prototype.move = function (car) {
    // handle player movement
    // console.log(player.x,player.y);

    // keep the player in bounds
  if (car.x < 0) car.x = 0
  if (car.x > this.width)car.x = this.width - 0.2
  if (car.y < 0) car.y = 0
  if (car.y > this.height)car.y = this.height - 0.2

  let tileX = Math.floor(car.x)
  let tileY = Math.floor(car.y)

  let heading = car.heading
  let turning = car.turning
  let speed = Math.abs(car.speed)
  if (car.speed < 0) {
    heading = (heading + 2) % 4
  }

  let carTile = this.data[tileY * this.width + tileX % this.width]
  if (carTile !== 0)carTile--//  due to the first gid in the tiled format, this could break with multiple tilesets TODO make robust

  const validMoves = tileGraphDict[carTile]
  if (validMoves === undefined) {
    console.log('WARNING undefined tile in map_class.js, ' + carTile + ', at coords: ' + tileX + ',' + tileY)
    console.log(car.x, car.y)
  }

  if (car.midturn === 0) {
        // check to see if a turn should be initiated
        // console.log(car.heading,car.turning);
        // console.log(validMoves);

    if (turning !== 1 && validMoves[heading][turning]) {
            // the car wants to turn and can
      car.midturn = turning - 1
      console.log('turn initiated by press!')
    }
    if (!validMoves[heading][1]) {
            // the car wants to go straight and can't
      car.midturn = validMoves[heading].indexOf(1) - 1
      console.log('turn initiated by necessity!')
    }
  }

    // set car angle for aesthetic purposes
  car.angle = (headingToAngle[car.heading] + car.midturn * 90 * car.progress + 360) % 360

    // advance the car through the section
  car.progress += speed

  if (car.midturn === 0) {
        // go straight
        // console.log("straight!");

        // car.angle=headingToAngle[car.heading];

        // this causes the car to stutter when going north or west...

    car.x = tileX + startPoint[heading][0] + car.progress * headingsToVector[heading][0]
    car.y = tileY + startPoint[heading][1] + car.progress * headingsToVector[heading][1]

        /*
        direction= headingsToVector[heading];
        car.x+=direction[0]*speed;
        car.y+=direction[1]*speed;
        */
  } else {
        // turn
        // console.log("turning!");
        // a turn is only 80% the length as going straight, for now we'll still make it take 100% of the time for simplicity
    car.x = tileX + startPoint[heading][0] + car.progress * 0.5 * (headingsToVector[heading][0] + headingsToVector[(heading + car.midturn + 4) % 4][0])// the +4 is bc js modulo sucks
    car.y = tileY + startPoint[heading][1] + car.progress * 0.5 * (headingsToVector[heading][1] + headingsToVector[(heading + car.midturn + 4) % 4][1])
        /*
        car.x= tileX +startPoint[heading][0] + 0.5*Math.sin((0.8/car.progress)*Math.PI*0.5*(-1)*car.midturn + (heading-1)*Math.PI*0.5);
        car.y= tileY +startPoint[heading][1]+ 0.5*Math.cos((0.8/car.progress)*Math.PI*0.5*(-1)*car.midturn + (heading-1)*Math.PI*0.5);
        */
  }

  if (car.progress > 1) {
        // store info for next car and reset car state

    if (car.attached_front === undefined) {
      car.progress = 0 // TODO we should bank the extra distance right?
    } else {
            // sync the car up with the rest of the train? TODO make this legit
      car.progress = car.attached_front.progress
    }

    car.last_turn = car.midturn + 1
    car.last_heading = car.heading
    car.heading = (car.heading + car.midturn + 4) % 4// important to turn the train!
    car.midturn = 0 // important to end the turn! ...... after you change the heading lol
        // console.log("turn complete!");
  } else  {
        // don't exit tile by a rounding error on a turn
        // console.log(car.x,car.y);

    car.x = Math.min(Math.max(tileX, car.x), tileX + 0.999)
    car.y = Math.min(Math.max(tileY, car.y), tileY + 0.999)
  }
}

Gmap.prototype.detectCollisions = function (x,y,w,h) {
  //iterate over map objects to determine whether the box bounded by (x,y) (x+w,y+h) intersects with any game objects whose references are stored in this.objects
  // a map object might be a train car or a building, for now bullets don't collide with eachother so that should help limit the computations?
}



module.exports = Gmap
