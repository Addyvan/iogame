/*
    The train car class

    the train car can be attached to other cars to form a chain

    TODO put all the values into the config file

    TODO make the cars not decouple from the train

    car types:
        0- misc car
        1- engine
*/

// Constructor
function Car (args = {}) {
  this.player = undefined
  this.x = undefined
  this.y = undefined
  this.angle = 0
  this.type = 0
  this.turning = 1
  this.heading = undefined
  this.midturn = 0
  this.last_heading = undefined
  this.progress = 0
  this.speed = 0
  this.attached_front = undefined
  this.attached_back = undefined
  this.next_tile = undefined
  this.last_turn = undefined
  this.snapshot_data = {}
  this.game = undefined
  this.next_turn = undefined // TODO
  this.reversing = 0

    // this.prep_snapshot();
}

var headingsToVector = {
    // TODO put this in some sort of Utils file?
  0: [0, -1], // north
  1: [1, 0], // east
  2: [0, 1], // south
  3: [-1, 0] // west
}

// class methods

Car.prototype.prep_snapshot = function () {
    // http://stackoverflow.com/questions/16880418/javascript-pass-object-as-reference
    // super important , js passes by copy reference so we can't reassign the object!
    /*
    //this way is bad and won't work!
    this.snapshot_data={
                        x:this.x,
                        y:this.y,
                        angle:this.angle,
                        type:this.type
        };

    */

    // this way will!
  this.snapshot_data.x = Math.round(this.x * 100)
  this.snapshot_data.y = Math.round(this.y * 100)
  this.snapshot_data.angle = Math.round(this.angle)
  this.snapshot_data.type = this.type

    // call the next car which will call the next car and so on...
  if (this.attached_back) {
    this.attached_back.prep_snapshot()
  }
}

Car.prototype.get_turn = function () {
    // get the cars action
  if (this.attached_front === undefined ) return 1 // go straight

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

  //return this.attached_front.last_turn
  return (3+ this.heading-this.attached_front.heading)%4
}

Car.prototype.update_position = function () {
  //update the car's position


  //update the car's velocity
  if (this.attached_front === undefined) {
    //todo make unattached cars behave well
  }
  else {
    this.speed = this.attached_front.speed
  }





  if (this.speed < 0 && !this.reversing) {
    this.reversing = 1
    this.progress = 0.99 - this.progress
    if(this.midturn!=0){
      //resolve the incomplete turn
      this.heading = (this.heading + this.midturn + 4) % 4// important to turn the train!
      this.midturn= 0
    } 
  }

  if (this.speed > 0 && this.reversing) {
    this.reversing = 0
    this.progress = 0.99 - this.progress
    if(this.midturn!=0){
      //resolve the incomplete turn
      this.heading = (this.heading + this.midturn + 4) % 4// important to turn the train!
      this.midturn= 0
    } 
  }

  this.game.map.move(this)

  this.turning = this.get_turn()// this has to be done after moving but also in proper order
    // call the next car
  if (this.attached_back) {
    this.attached_back.update_position()
  }
}

Car.prototype.attach = function (target) {
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

  this.player.snapshot_data.cars.push(this.snapshot_data)
}

module.exports = Car
