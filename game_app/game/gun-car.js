/*
    This class inherits from the car class
    The gun car can shoot projectiles

*/

const path = require('path')
const _ = require('lodash')

const carFactory = require(path.resolve(__dirname, 'car.js'))
const Projectile = require(path.resolve(__dirname, 'projectile.js'))

function tick () {
  if (this.reload) {
    this.reload -= 1
  } else if (this.player.actions.clicking) {
    this.shoot()
  }

  if (this.attached_back) {
    this.attached_back.tick()
  }
}

function shoot () {
  if (this.reload === 0) {
        // console.log("pew pew!")
    const args = {
      x: this.x,
      y: this.y,
      speed: 20,
      range: 20,
      player: this.player
    }
    const dir = {x: 0, y: 0}
        // todo this formula is wrong
    //console.log(this.player.mouse.x, this.x)
    dir.x = (this.player.mouse.x - this.x) / (Math.abs(this.player.mouse.x - this.x) + Math.abs(this.player.mouse.y - this.y))
    dir.y = (this.player.mouse.y - this.y) / (Math.abs(this.player.mouse.x - this.x) + Math.abs(this.player.mouse.y - this.y))
    args.dir = dir
    //console.log(dir)
    const test = new Projectile(args)
    this.reload = 13 // make this a prime ( or at least odd number so that we can check the projectile's collisions in batches)
  }
}

function gunCarFactory () {
  return _.merge({}, carFactory(), {
    type: 2,
    hp: 100,
    reload: 0,
    tick,
    shoot
  })
}

// export our class
module.exports = gunCarFactory
