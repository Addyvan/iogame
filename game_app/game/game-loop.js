const path = require('path')

const gameMapFactory = require(path.resolve(__dirname, 'map_class'))
const Player = require(path.resolve(__dirname, 'player_class'))

function step () {
  this.players.forEach((player) => player.tick())

  // increment the game tick and set the timestamp
  this.tick = (this.tick + 1) % 100000

  // 86400000 is # milliseconds in a day, apparently the timestamp was too big to fit in 4 bytes and that caused issues
  // TODO figure out if this is the best method, also apparently node has higher res timing?
  this.timestamp = Date.now() % 86400000

  if (this.tick % 100 === 1) console.log(`GAME TICK: ${this.tick}`)
}

function start () {
  // this function starts the game loop. there is no function to end it presently
  // http://stackoverflow.com/questions/10129363/javascript-class-this-method-called-with-setinterval
  // this behaves very strangely in js apparently
  const myobj = this
  setInterval(function () { myobj.step() }, 1000 / 60)
}

function addPlayer (id, query) {
  console.log(`${query.username} is joining the game`)

  // CRITICAL TODO, findout whether or not this is passing a pointer or some crazy recursive copy
  const newPlayer = new Player({ id: id, username: query.username, game: this })
  this.players.push(newPlayer)
  return newPlayer
}

function removePlayer (id) {
  this.players = this.players.filter((player) => {
    return player.id !== id
  })
}

function snapshot () {
  return {
    tick: this.tick,
    timestamp: this.timestamp,
    id: 'todo',
    players: this.players.map((player) => player.snapshot_data)
  }
}

function gameLoopFactory () {
  return {
    tick: 0,
    players: [],
    map: gameMapFactory(),
    step,
    start,
    addPlayer,
    removePlayer,
    snapshot
  }
}

module.exports = gameLoopFactory
