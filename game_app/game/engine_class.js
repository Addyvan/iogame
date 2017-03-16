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

/*
Engine.prototype.update_position = function () {
    // apply acceleration and update position
  this.speed += this.accel_rate * this.accelerating

  if (this.speed < 0) {
    if (!this.reversing) {
      this.reversing = 1
      this.progress = 0.99 - this.progress //0.99 to stop jumps
    }
    this.speed = Math.max(this.speed, -0.5 * this.max_speed)
  } else if (this.speed > 0) {
    if (this.reversing) {
      this.reversing = 0
      this.progress = 0.99 - this.progress
    }
    this.speed = Math.min(this.speed, this.max_speed)
  }

  this.game.map.move(this)

    // call the next car which will call the next car and so on...
  if (this.attached_back) {
    this.attached_back.update_position()
  }
}
*/
Engine.prototype.tick = function(){
  //todo make the inputs condtion on heading



  if (this.player.actions.up) { // up
    this.accelerating = 1
  } 
  else if (this.player.actions.down) { // down
    this.accelerating = -1
  } else {
    this.accelerating = 0
  }

  this.speed += this.accel_rate * this.accelerating
  if(Math.abs(this.speed)>10/60 ){
    //todo implement max speed system
    //todo figure out if we even need to worry about speeds over 59 tiles per second lol
    this.speed= Math.abs(this.speed)/this.speed *10/60
  }
  
  if (this.attached_back) {
    //should we run the ticks before movement? not sure it matters
    this.attached_back.tick()
  }

  this.update_position()
}

Engine.prototype.get_turn = function(){
  // the engine is the front train so it beahves differently a little
  // todo make sure that this isn't dirrectly edited by user inputs mid  loop

 if(this.speed < 0){
    // follow the car attached to the back of this car
    if(this.attached_back === undefined ){
      return 1
    }
    else{
      // go towards the car you're attached to by following their heading
      if(this.attached_back.heading== this.heading){
        return 1
      }
      else{
        //todo verify this since I made it up with a gut feeling and it's likely wrong -a 
        return ((3+ this.heading-this.attached_back.heading)%4)
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
// export our class
module.exports = Engine
