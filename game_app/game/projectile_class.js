/*
    This class forms the base behaviour that other projectiles will inherit from

*/

const path = require('path')

// Constructor
function Projectile (args = {}) {

}


//class methods
Projectile.prototype.tick = function(){
  //this function is called every tick
}

module.exports = Projectile