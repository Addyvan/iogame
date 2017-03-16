/*
    The player class

    TODO:
        -put all the values into the config file
        -move all car related functions to the engine class so that the player doesn't have coordinates in this class
*/

const path = require('path')

const engineFactory = require(path.resolve(__dirname, 'engine.js'))
const carFactory = require(path.resolve(__dirname, 'car.js'))
const gunCarFactory = require(path.resolve(__dirname, 'gun-car.js'))

function getCars (car) {
  if (!car.attached_back) {
    return [car]
  } else {
    return [car].concat(getCars(car.attached_back))
  }
}

function snapshot () {
  return {
    id: this.id,
    username: this.username,
    cars: getCars(this.engine).map((car) => car.snapshot())
  }
}

function tick () {
    // this function is called every tick for each player to update their game state
  this.engine.tick()
}

function spawn () {
    // spawns the player which uses the map to set their coords
    // also resets various values

  var initNumCars = 10 // Move this guy somewhere meaningful

  console.log('spawning!')
    // console.log(this);
  this.dead = 0
  this.engine = engineFactory(this)

  this.game.map.spawnLocation(this.engine)

  var CAR_ARR = new Array(this.engine)

  for (var x = 1; x < initNumCars; x++) {
    if (x % 3 === 0) {
      CAR_ARR.push(gunCarFactory())
    } else {
      CAR_ARR.push(carFactory())
    }

    CAR_ARR[x].attach(CAR_ARR[x - 1])
  }
}

function parse (inputs) {
    // parse player inputs
    // todo make this take into context the trains orientation so that controls are properly mapped
    // todo move this to the engine class when it is fixed up
  this.actions.up = inputs.actions[0]
  this.actions.down = inputs.actions[1]
  this.actions.left = inputs.actions[2]
  this.actions.right = inputs.actions[3]
  this.actions.clicking = inputs.actions[4]

  this.mouse.x = inputs.mouse.x / 100
  this.mouse.y = inputs.mouse.y / 100
}

function RIP () {
    // RIP in peace
    // TODO

    // remove all cars

}

function playerFactory (id, game, username) {
  return {
    id,
    game,
    username: username || 'a rando train',
    actions: {
      left: 0,
      right: 0,
      up: 0,
      down: 0,
      clicking: 0
    },
    mouse: {
      x: 0,
      y: 0
    },
    dead: 1,
    cars: [],
    tick,
    snapshot,
    spawn,
    parse,
    RIP
  }
}

module.exports = playerFactory
