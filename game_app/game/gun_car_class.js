/*
    This class inherits from the car class 
    The gun car can shoot projectiles


*/

const path = require('path')

const Car = require(path.resolve(__dirname, 'car_class.js'))
const Projectile = require(path.resolve(__dirname, 'projectile_class.js'))
const util = require('util')


// Constructor
function GunCar (args = {}) {
  Car.apply(this, args)

  this.type = 2 // 2 for gun car
  this.hp = 100 // todo put this in a config file
  this.reload=0 
}
util.inherits(GunCar, Car)

//class methods
GunCar.prototype.tick = function(){
  if (this.reload){
    this.reload-=1
  }else if(this.player.actions.clicking){
    this.shoot()
  }


  if (this.attached_back) {
    this.attached_back.tick()
  }
}

GunCar.prototype.shoot = function(){

    if(this.reload==0){
        //console.log("pew pew!")
        args={
            x:this.x,
            y:this.y,
            speed: 20,
            range: 20,
            player:this.player
        }
        dir={x:0, y:0}
        //todo this formula is wrong
        console.log(this.player.mouse.x,this.x)
        dir.x= (this.player.mouse.x -this.x)/(Math.abs(this.player.mouse.x -this.x)+Math.abs(this.player.mouse.y -this.y))
        dir.y= (this.player.mouse.y -this.y)/(Math.abs(this.player.mouse.x -this.x)+Math.abs(this.player.mouse.y -this.y))
        args.dir=dir
        console.log(dir)
        test= new Projectile(args )
        this.reload=30
    }

    

}



// export our class
module.exports = GunCar