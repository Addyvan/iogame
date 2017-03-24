/*
    The train car class

    the train car can be attached to other cars to form a chain

    TODO put all the values into the config file

    TODO make the cars not decouple from the train

    car types:
        0- misc car
        1- engine
*/

var headingsToVector = {
  // TODO put this in some sort of Utils file?
  0: [0, -1], // north
  1: [1, 0], // east
  2: [0, 1], // south
  3: [-1, 0] // west
}

// class methods
function tick () {
  // base cars don't do anything but others might
  // this is not where movement is resolved this is for shooting and stuff

  if (this.attached_back) {
    this.attached_back.tick()
  }
}

function snapshot () {
  return {
    hp:this.hp,
    x: this.x * 100,
    y: this.y * 100,
    angle: this.angle,
    type: this.type
  }
}

function getTurn () {
    // get the cars action
  if (!this.attached_front) return 1 // go straight

  if (this.speed < 0) {
    // follow the car attached to the back of this car
    if (!this.attached_back) {
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

  // return this.attached_front.last_turn
  return (3 + this.heading - this.attached_front.heading) % 4
}

function updatePosition () {
  // update the car's position

  // update the car's velocity
  if (!this.attached_front) {
    // todo make unattached cars behave well
  } else {
    this.speed = this.attached_front.speed
  }

  if (this.speed < 0 && !this.reversing) {
    this.reversing = 1
    this.progress = 0.99 - this.progress //todo figure out how robust this is
    if (this.midturn !== 0) {
      // resolve the incomplete turn
      this.heading = (this.heading + this.midturn + 4) % 4// important to turn the train!
      this.midturn = 0
    }
  }

  if (this.speed > 0 && this.reversing) {
    this.reversing = 0
    this.progress = 0.99 - this.progress
    if (this.midturn !== 0) {
      // resolve the incomplete turn
      this.heading = (this.heading + this.midturn + 4) % 4// important to turn the train!
      this.midturn = 0
    }
  }

  this.game.map.move(this)

  this.turning = this.getTurn()// this has to be done after moving but also in proper order
    // call the next car
  if (this.attached_back) {
    this.attached_back.updatePosition()
  }
}

function attach (target) {
    // attach the car to another car
  this.attached_front = target
  this.game = target.game

  target.attached_back = this

  this.heading = target.last_heading
  this.last_heading = target.last_heading// MAJOR TODO, if the track isn't straight it will cause an error
  this.progress = target.progress
    // console.log(target);
  this.x = target.x - headingsToVector[target.heading][0]
  this.y = target.y - headingsToVector[target.heading][1]

  this.player = target.player

  this.player.cars.push(this)
  this.player.game.map.addCollidable(this) //todo put thsi is a better spot
}

function takeDamage(damage){
  this.hp -= damage
  if(this.hp<=0){
    this.hp=0
    this.die()
  }
}

function die(){
  // the car is dead
  // todo
  console.log("I died :(((((")
  this.player.RIP() //todo atm one car dieing kills the player
}

function carFactory () {
  return {
    angle: 0,
    type: 0,
    turning: 1,
    midturn: 0,
    progress: 0,
    speed: 0,
    reversing: 0,
    hp:100, //todo put in config file
    takeDamage,
    die,
    tick,
    snapshot,
    getTurn,
    updatePosition,
    attach
  }
}

module.exports = carFactory
