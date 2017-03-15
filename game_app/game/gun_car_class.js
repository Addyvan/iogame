/*
    This class inherits from the car class 
    The gun car can shoot projectiles


*/

const path = require('path')

const Car = require(path.resolve(__dirname, 'car_class.js'))
const util = require('util')


// Constructor
function GunCar (args = {}) {
  Car.apply(this, args)

  this.type = 2 // 2 for gun car
  this.hp = 100 // todo put this in a config file
}


//class methods
Engine.prototype.shoot = function(){

}



// export our class
module.exports = GunCar