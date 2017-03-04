// listen for clients trying to connect to the server and send them a simple message when they connect
var io = require('socket.io')();


// Import game settings.
var c = require(__dirname +'/game/config.json');

//Import serializer get and set 
//https://github.com/ThreeLetters/SimpleProtocols
//atm the code generator is buggy but it's fixable
var sp_set= require(__dirname +'/game/setNodeJS.js');
var sp_get= require(__dirname +'/game/getNodeJS.js');

// Keep a dict of active connections
var sockets = {};

//http://stackoverflow.com/questions/4213351/make-node-js-not-exit-on-error
// we don't want the server to stope if an error occurs
//TODO make it show the stack trace
/*
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
*/



io.on('connection', function(socket){
    //type is sent by the client and could be used to determine whether or not the player is spectating?
    console.log('A user connected!', socket.handshake.query);

    //add the client to the dict of sockets
    sockets[socket.id]=socket;

    // add the client to the game room 
    // no real reason for this now but might be good for later optimization to have it in
    socket.join('game');

    socket.player=game_loop.add_player(socket.id,socket.handshake.query);

    socket.on('a',function(moves_binary){
        // receive key inputs from the player
        //console.log(moves_binary);
        moves= sp_get.get(moves_binary);
        //console.log(moves);
        socket.player.parse(moves);
    });
    socket.on('disconnect', function(reason){
        game_loop.remove_player(socket.id,socket.handshake.query);
    });
    io.emit('playerID',{id: socket.id});
});

broadcast = function(){
    // broadcast a snapshot to all clients
    // TODO improve general efficiency
    if (game_loop.snapshot===undefined) return;
    binary_snapshot = sp_set.set(game_loop.snapshot);
    //console.log(game_loop.snapshot);
    //console.log(binary_snapshot);

    io.in('game').emit('s', binary_snapshot);
};




//activate the socket
io.listen(c["port"]);
console.log("listening on port "+ c["port"]);

//load in some classes
Player=require(__dirname +'/game/player_class.js')
Gmap= require(__dirname +'/game/map_class.js')

//begin the game loop
Game_loop=require(__dirname +'/game/game_server_loop.js');
var game_loop = new Game_loop();
game_loop.start();


// begin broadcasting
setInterval(broadcast,1000/20);