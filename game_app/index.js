const path = require('path')

const config = require(path.resolve(__dirname, 'game', 'config.json'))
const GameLoop = require(path.resolve(__dirname, 'game', 'game_server_loop.js'))

// Import serializer get and set
// https://github.com/ThreeLetters/SimpleProtocols
// At the moment the code generator is buggy but it's fixable.
const spSet = require(path.resolve(__dirname, 'game', 'setNodeJS.js'))
const spGet = require(path.resolve(__dirname, 'game', 'getNodeJS.js'))

const io = require('socket.io')()

const sockets = {}

// http://stackoverflow.com/questions/4213351/make-node-js-not-exit-on-error
// we don't want the server to stope if an error occurs
// TODO make it show the stack trace
//
// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });

io.on('connection', function (socket) {
  // type is sent by the client and could be used to determine whether or not the player is spectating?
  console.log('A user connected!', socket.handshake.query)

  sockets[socket.id] = socket

  socket.join('game')

  socket.player = gameLoop.add_player(socket.id, socket.handshake.query)

  socket.on('a', function (movesBinary) {
    socket.player.parse(spGet.get(movesBinary))
  })

  socket.on('disconnect', function (reason) {
    gameLoop.remove_player(socket.id, socket.handshake.query)
  })

  socket.emit('playerID', {id: socket.id})
})

function broadcast () {
  // TODO improve general efficiency
  if (!gameLoop.snapshot) return

  const binarySnapshot = spSet.set(gameLoop.snapshot)

  io.in('game').emit('s', binarySnapshot)
}

io.listen(config.port)
console.log('listening on port ' + config.port)

const gameLoop = new GameLoop()
gameLoop.start()

setInterval(broadcast, 1000 / 20)
