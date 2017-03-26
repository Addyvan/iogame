/*
    Should contain lag compensation and clock syncing

*/

connect_to_socket = function (type = 'player') {
  window.socket = io.connect('http://localhost:' + GAME_PORT, {query: 'type=' + type})
  socket.on('playerID', function (data) {
    PLAYER_ID = data.id
  })

    // on snapshot
  socket.on('s', parse_snapshot)// in game.js

  //on events
  socket.on('e', parse_events) // in game.js

  // on messages
  socket.on('message', parse_message)// in ui-controls.js
}

