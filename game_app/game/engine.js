/*
    This class inherits from the car class and is a car that is self propelled

    todo: flesh this class out and move all the car car based movement from the player class to here
*/

const path = require('path')
const _ = require('lodash')

const carFactory = require(path.resolve(__dirname, 'car.js'))

function tick () {
  // todo make the inputs condtion on heading

  if (this.player.actions.up) { // up
    this.accelerating = 1
  } else if (this.player.actions.down) { // down
    this.accelerating = -1
  } else {
    this.accelerating = 0
  }

  this.speed += this.accel_rate * this.accelerating
  if (Math.abs(this.speed) > 10 / 60) {
    // todo implement max speed system
    // todo figure out if we even need to worry about speeds over 59 tiles per second lol
    this.speed = Math.abs(this.speed) / this.speed * 10 / 60
  }

  if (this.attached_back) {
    // should we run the ticks before movement? not sure it matters
    this.attached_back.tick()
  }

  this.updatePosition()
}

function getTurn () {
  // the engine is the front train so it beahves differently a little
  // todo make sure that this isn't dirrectly edited by user inputs mid  loop

  if (this.speed < 0) {
    // follow the car attached to the back of this car
    if (this.attached_back === undefined) {
      return 1
    } else {
      // go towards the car you're attached to by following their heading
      if (this.attached_back.heading === this.heading) {
        return 1
      } else {
        // todo verify this since I made it up with a gut feeling and it's likely wrong -a
        return ((3 + this.heading - this.attached_back.heading) % 4)
      }
    }
  }

  if (this.player.actions.left) { // left
    this.turning = 0
  } else if (this.player.actions.right) { // right
    this.turning = 2
  } else {
    this.turning = 1
  }
  return this.turning
}

function engineFactory (player) {
  return _.merge({}, carFactory(), {
    player,
    game: player.game,
    type: 1,
    hp: 100,
    turning: 1,
    accelerating: 0,
    max_health: 100,
    accel_rate: 0.05 / 60,
    max_speed: 7 / 60,
    tick,
    getTurn
  })
}

// export our class
module.exports = engineFactory
