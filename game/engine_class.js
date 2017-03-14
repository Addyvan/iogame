/*
    This class inherits from the car class and is a car that is self propelled

    todo: flesh this class out and move all the car car based movement from the player class to here

    inheritance: http://stackoverflow.com/questions/16213495/how-to-implement-inheritance-in-node-js-modules
*/

const path = require('path')

const Car = require(path.resolve(__dirname, 'car_class.js'))
const util = require('util')

// Constructor
function Engine (args = {}) {
  Car.apply(this, args)

  this.player = args.player
  this.game = this.player.game
  this.player.snapshot_data.cars.push(this.snapshot_data)

  this.type = 1 // 1 for engine
  this.hp = 100 // todo put this in a config file

    // actions
  this.turning = 1 // 0 for left, 1 for straight, 2 for right
  this.accelerating = 0

    // stats
    // TODO move to config file
  this.max_health = 100
  this.accel_rate = 0.05 / 60
  this.max_speed = 7 / 60 // you can fly off the tracks if this is too high
}
util.inherits(Engine, Car)

// class methods

// ////////////////////////////////////////////
// Calvin Tidied 7/03/17
// ////////////////////////////////////////////

Engine.prototype.update_position = function () {
    // apply acceleration and update position
  this.speed += this.accel_rate * this.accelerating

  if (this.speed < 0) {
    if (!this.reversing) {
      this.reversing = 1
      this.progress = 1 - this.progress
    }
    this.speed = Math.max(this.speed, -0.5 * this.max_speed)
  } else if (this.speed > 0) {
    if (this.reversing) {
      this.reversing = 0
      this.progress = 1 - this.progress
    }
    this.speed = Math.min(this.speed, this.max_speed)
  }

  this.game.map.move(this)

    // call the next car which will call the next car and so on...
  if (this.attached_back) {
    this.attached_back.update_position()
  }
}

// export our class
module.exports = Engine
