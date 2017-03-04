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

    game_loop.add_player(socket.id,socket.handshake.query);

    socket.on('a',function(moves_binary){
        // receive key inputs from the player
        console.log(moves_binary);
        moves= sp_get.get(moves_binary);
        console.log(moves);
    });
    socket.on('disconnect', function(reason){
        game_loop.remove_player(socket.id,socket.handshake.query);
    });
    io.emit('message',{message: 'socket connected!'});
});






//activate the socket
io.listen(c["port"]);
console.log("listening on port "+ c["port"]);

//begin the game loop
Player=require(__dirname +'/game/player_class.js')

Game_loop=require(__dirname +'/game/game_server_loop.js');
var game_loop = new Game_loop();
console.log(game_loop.tick);
game_loop.step();
game_loop.start();