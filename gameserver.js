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
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});




io.on('connection', function(client){
    //type is sent by the client and could be used to determine whether or not the player is spectating?
    console.log('A user connected!', client.handshake.query);

    client.on('a',function(moves_binary){
        console.log(moves_binary);
        moves= sp_get.get(moves_binary);
        console.log(moves);
    });
    
    io.emit('message',{message: 'socket connected!'});
});






//activate the socket
io.listen(c["port"]);
console.log("listening on port "+ c["port"]);

