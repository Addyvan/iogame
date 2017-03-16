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

const tileGraph = require(path.resolve(__dirname, '../enums/tile-graph.js'))
const headingToVector = require(path.resolve(__dirname, '../enums/heading-to-vector.js'))
const startPoint = require(path.resolve(__dirname, '../enums/start-point.js'))
const headingToAngle = require(path.resolve(__dirname, '../enums/heading-to-angle.js'))

function load (mapJsonName) {
  // load and parse a mapJson file
  this.map_name = mapJsonName
  const mapJson = require(path.resolve(__dirname, '../maps', mapJsonName))
  this.width = mapJson.width
  this.height = mapJson.height

  this.data = mapJson.layers.find((layer) => layer.name === 'tracks').data
}

function spawnLocation (player, team = 0) {
  // spawn the player at a spawn point according to their team
  // TODO
  player.x = 33.5
  player.y = 9.5
  player.heading = 1
  player.last_heading = 1
}

function move (car) {
  // keep the player in bounds
  if (car.x < 0) {
    car.x = 0
  }
  if (car.x > this.width) {
    car.x = this.width - 0.2
  }
  if (car.y < 0) {
    car.y = 0
  }
  if (car.y > this.height) {
    car.y = this.height - 0.2
  }

  let tileX = Math.floor(car.x)
  let tileY = Math.floor(car.y)

  let heading = car.heading
  let turning = car.turning
  let speed = Math.abs(car.speed)

  if (car.speed < 0) {
    heading = (heading + 2) % 4
  }

  let carTile = this.data[tileY * this.width + tileX % this.width]
  //  due to the first gid in the tiled format, this could break with multiple tilesets TODO make robust
  if (carTile !== 0) {
    carTile--
  }

  const validMoves = tileGraph[carTile]
  if (!validMoves) {
    console.log('WARNING undefined tile in map_class.js, ' + carTile + ', at coords: ' + tileX + ',' + tileY)
    console.log(car.x, car.y)
  }

  if (car.midturn === 0) {
    // Check to see if a turn should be initiated

    if (turning !== 1 && validMoves[heading][turning]) {
      // the car wants to turn and can
      car.midturn = turning - 1
    }
    if (!validMoves[heading][1]) {
      // the car wants to go straight and can't
      car.midturn = validMoves[heading].indexOf(1) - 1
    }
  }

  // set car angle for aesthetic purposes
  car.angle = (headingToAngle[car.heading] + car.midturn * 90 * car.progress + 360) % 360

  // advance the car through the section
  car.progress += speed

  if (car.midturn === 0) {
    // go straight
    car.x = tileX + startPoint[heading][0] + car.progress * headingToVector[heading][0]
    car.y = tileY + startPoint[heading][1] + car.progress * headingToVector[heading][1]
  } else {
    // turn
    // a turn is only 80% the length as going straight, for now we'll still make it take 100% of the time for simplicity
    car.x = tileX + startPoint[heading][0] + car.progress * 0.5 * (headingToVector[heading][0] + headingToVector[(heading + car.midturn + 4) % 4][0])// the +4 is bc js modulo sucks
    car.y = tileY + startPoint[heading][1] + car.progress * 0.5 * (headingToVector[heading][1] + headingToVector[(heading + car.midturn + 4) % 4][1])
  }

  if (car.progress > 1) {
    // store info for next car and reset car state

    if (!car.attached_front) {
      car.progress = 0 // TODO we should bank the extra distance right?
    } else {
      // sync the car up with the rest of the train? TODO make this legit
      car.progress = car.attached_front.progress
    }

    car.last_turn = car.midturn + 1
    car.last_heading = car.heading
    car.heading = (car.heading + car.midturn + 4) % 4// important to turn the train!
    car.midturn = 0 // important to end the turn! ...... after you change the heading lol
  } else {
    // don't exit tile by a rounding error on a turn
    car.x = Math.min(Math.max(tileX, car.x), tileX + 0.999)
    car.y = Math.min(Math.max(tileY, car.y), tileY + 0.999)
  }
}

function detectCollisions (x, y, w, h) {
  // iterate over map objects to determine whether the box bounded by (x,y) (x+w,y+h) intersects with any game objects whose references are stored in this.objects
  // a map object might be a train car or a building, for now bullets don't collide with eachother so that should help limit the computations?
}

function gameMapFactory () {
  return {
    load,
    spawnLocation,
    move,
    detectCollisions
  }
}

module.exports = gameMapFactory
