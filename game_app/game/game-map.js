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
  this.spawns = mapJson.layers.find((layer) => layer.name === 'spawns').objects
  console.log(this.spawns)
}

function spawnLocation (player, team = 0) {
  // spawn the player at a spawn point according to their team
  // TODO

  var spawn = this.spawns[Math.floor(Math.random()*this.spawns.length)]
  player.x = Math.floor(spawn.x/16) +0.5
  player.y = Math.floor(spawn.y/16) +0.5

  player.heading = Number(spawn.properties.heading)
  player.last_heading = Number(spawn.properties.heading) // is this still used?
  console.log("spawning at:", player.x,player.y,player.heading)
}

function addCollidable (collidable){
  // add an object to the list of things that can be collided with 
  this.collidables.push(collidable)
}

function removeCollidable (collidable){
  // remove an object to the list of things that can be collided with 
  this.collidables = this.collidables.filter((c) => {
    return c != collidable
  })
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
      car.progress = car.progress%1 // TODO we should bank the extra distance right?
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
  // this is a temporary solution so that I can go forward with other parts of the game - andrew
  // note that the forEach loop is the wrong tool for this job 
  //http://stackoverflow.com/questions/34653612/what-does-return-keyword-mean-inside-foreach-function/34653650

  for(let i =0, len= this.collidables.length; i<len; i++){
    if(this.checkCollision(this.collidables[i],x,y,w,h)){
      return this.collidables[i] // this exits the loop right?
    }
  }
}

function checkCollision(collidable,x,y,w,h){
  // todo atm assume width and height of cars is 1 and the object is a point mass
  // the cars are kind of tall so I made the hit boxes a bit taller ( i think I got the directions right?)
  if(collidable.x-0.5 < x && x <collidable.x+0.5 && collidable.y-1 < y&& y <collidable.y+0.5){
    //console.log(collidable.x,x,collidable.y,y)
    return true
  }
}

function gameMapFactory () {
  return {
    collidables:[],
    addCollidable,
    removeCollidable,
    load,
    spawnLocation,
    move,
    detectCollisions,
    checkCollision
  }
}

module.exports = gameMapFactory
