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

  //NTP clock syncing
  socket.on('NTP' ,parse_time) // in this file

  // start a clock sync
  sync_clocks()
}

send_username = function(username){
  socket.emit("username",username)
}

TIME_SAMPLES=[]
sync_clocks= function(){
  //this needs to be done really well
  // atm we request 11 samples then take the average of the middle 3
  request_ntp_sample()
}

TIME_SAMPLE_REQUESTED=undefined

request_ntp_sample= function(){
  TIME_SAMPLE_REQUESTED = Date.now();
  socket.emit('NTP',0)
}
parse_time= function(serverTime){
  //take sample and add it to list, if there are fewer than 11 samples request another sample
  current_time= Date.now();
  ping=(current_time-TIME_SAMPLE_REQUESTED)/2
  TIME_SAMPLES.push(serverTime- (TIME_SAMPLE_REQUESTED+ping)) 
  if (TIME_SAMPLES.length<11){
    request_ntp_sample()
  }else{
    TIME_SAMPLES.sort(function(a, b){return a-b})
    console.log(TIME_SAMPLES)
    SERVER_TIME_AHEAD=Math.floor(TIME_SAMPLES.slice(4,7).reduce(add,0) /3)
    console.log("server time offset is:",SERVER_TIME_AHEAD )
  }
}