const path = require('path')

// listen for clients trying to connect to the server and send them a simple message when they connect
var io = require('socket.io')()

// Import game settings.
var c = require(path.resolve(__dirname, 'game', 'config.json'))

// Import serializer get and set
// https://github.com/ThreeLetters/SimpleProtocols
// atm the code generator is buggy but it's fixable
var spSet = require(path.resolve(__dirname, 'game', 'setNodeJS.js'))
var spGet = require(path.resolve(__dirname, 'game', 'getNodeJS.js'))

// Keep a dict of active connections
var sockets = {}

// http://stackoverflow.com/questions/4213351/make-node-js-not-exit-on-error
// we don't want the server to stope if an error occurs
// TODO make it show the stack trace
/*
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
*/

io.on('connection', function (socket) {
    // type is sent by the client and could be used to determine whether or not the player is spectating?
  console.log('A user connected!', socket.handshake.query)

    // add the client to the dict of sockets
  sockets[socket.id] = socket

    // add the client to the game room
    // no real reason for this now but might be good for later optimization to have it in
  socket.join('game')

  socket.player = gameLoop.add_player(socket.id, socket.handshake.query)

  socket.on('a', function (movesBinary) {
        // receive key inputs from the player
        // console.log(movesBinary);
    const moves = spGet.get(movesBinary)
    //console.log(moves);
    socket.player.parse(moves)
  })
  socket.on('disconnect', function (reason) {
    gameLoop.remove_player(socket.id, socket.handshake.query)
  })
  socket.emit('playerID', {id: socket.id}) // make sure to only send theis to the client, io.emit was sending this to all players
})

function broadcast () {
    // broadcast a snapshot to all clients
    // TODO improve general efficiency
  if (gameLoop.snapshot === undefined) return
  const binarySnapshot = spSet.set(gameLoop.snapshot)
    // console.log(gameLoop.snapshot);
    // console.log(binarySnapshot);

  io.in('game').emit('s', binarySnapshot)
}

// activate the socket
io.listen(c['port'])
console.log('listening on port ' + c['port'])

// begin the game loop
const GameLoop = require(path.resolve(__dirname, 'game', 'game_server_loop.js'))
const gameLoop = new GameLoop()
gameLoop.start()

// begin broadcasting
setInterval(broadcast, 1000 / 20)
