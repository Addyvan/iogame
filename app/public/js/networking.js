/*
    Should contain lag compensation and clock syncing

*/

connect_to_socket = function (type = 'player') {
  host= $("#server-select").val()
  console.log("connecting to host ", host)
  window.socket = io.connect('http://' +host, {query: 'type=' + type})
  socket.on('playerID', function (data) {
    PLAYER_ID = data.id
  })

    // on snapshot
  socket.on('s', parse_snapshot)// in game.js

  //on events
  socket.on('e', parse_events) // in game.js

  // on messages
  socket.on('message', parse_message)// in ui-controls.js

  // on username confirmation
  socket.on('username-confirm',set_username) // in menu-controls.js

  // on leaderboard update
  socket.on('leaderboard',update_leaderboard ) // in ui-controls.js

  socket.on('round-info' ,parse_round_info) // in ui-controls.js for now
}

send_username = function(username){
    socket.emit("username",username)
}

