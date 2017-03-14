/*
    The player class

    TODO:
        -put all the values into the config file
        -move all car related functions to the engine class so that the player doesn't have coordinates in this class

    useful read on classes in node: http://book.mixu.net/node/ch6.html
*/

// Constructor
function Player (args) {
    // initialize variables

  this.id = args.id
  if (args.username === undefined || args.username == '') {
    this.username = 'a rando train'
  } else {
    this.username = args.username
  }
  this.game = args.game

  this.team = undefined
    // state
  this.dead = 1

    // cars chain
  this.engine = undefined

    // snapshot data is used so that we only have to send some of the data
  this.snapshot_data = {id: this.id,
    username: this.username,
    cars: []
  }
  this.spawn()
}

// class methods

Player.prototype.tick = function () {
    // this function is called every tick for each player to update their game state
  this.engine.update_position()
  this.prep_snapshot()
}

// //////////////////////////////////
// Calvin tidied 8/03/17
// Define # of cars to spawn in a loop
// //////////////////////////////////
Player.prototype.spawn = function () {
    // spawns the player which uses the map to set their coords
    // also resets various values

  var init_num_cars = 10 // Move this guy somewhere meaningful

  console.log('spawning!')
    // console.log(this);
  this.dead = 0
  this.engine = new Engine({player: this})

  this.game.map.spawn_location(this.engine)

  var CAR_ARR = new Array(this.engine)

  for (var x = 1; x < init_num_cars; x++) {
    CAR_ARR.push(new Car())
    CAR_ARR[x].attach(CAR_ARR[x - 1])
  }
}
Player.prototype.prep_snapshot = function () {
    // set the snapshot data fields
  this.engine.prep_snapshot()
}

Player.prototype.build_car_list = function () {
    // recursive function to build the car list for the snapshot
    // TODO didn't do this since it feel inneficient af
}

Player.prototype.parse = function (inputs) {
    // parse player inputs
    // todo make this take into context the trains orientation so that controls are properly mapped
    // todo move this to the engine class when it is fixed up
  if (inputs[0]) { // up
    this.engine.accelerating = 1
  } else if (inputs[1]) { // down
    this.engine.accelerating = -1
  } else {
    this.engine.accelerating = 0
  }

  if (inputs[2]) { // left
    this.engine.turning = 0
  } else if (inputs[3]) { // right
    this.engine.turning = 2
  } else {
    this.engine.turning = 1
  }
}

Player.prototype.RIP = function () {
    // RIP in peace
    // TODO

    // remove all cars

}

module.exports = Player
