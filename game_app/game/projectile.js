/*
    This class forms the base behaviour that other projectiles will inherit from

*/

const path = require('path')

// Constructor
function Projectile (args = {}) {
  this.startX = args.x
  this.startY = args.y
  this.x = this.startX
  this.y = this.startY
  this.dir = args.dir
  this.speed = args.speed // should just be normal ints
  this.range = args.range // should just be normal ints
  this.player = args.player
  this.game = this.player.game
  this.dist = 0

  this.id = this.player.id + this.game.tick // unique bullet identifier todo find a more complicated way to get shorter IDs

    // add the projectile to the list of projectiles
  this.game.projectiles.push(this)
  event_data = {
    timestamp: this.game.timestamp,
    x: Math.floor(this.x * 100),
    y: Math.floor(this.y * 100),
    dir: {x: Math.floor(this.dir.x * 100),
      y: Math.floor(this.dir.y * 100)},
    speed: Math.floor(this.speed),
    range: Math.floor(this.range),
    id: this.id
  }
  this.game.events.shots.push(event_data)
}

// class methods
Projectile.prototype.tick = function () {
  // this function is called every tick
  this.dist += this.speed / 60

  this.x = this.startX + this.dir.x * this.dist
  this.y = this.startY + this.dir.y * this.dist

  if (this.dist > this.range) {
    this.expire()
    return
  } else {
    // check for collision
  }
}

Projectile.prototype.expire = function () {
    // the bullet has expired. remove it from the game bullet list
  this.game.projectiles = this.game.projectiles.filter((projectile) => {
    return projectile.id !== this.id
  })
}

module.exports = Projectile
