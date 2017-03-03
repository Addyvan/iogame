// listen for clients trying to connect to the server and send them a simple message when they connect
var io = require('socket.io')();
io.on('connection', function(client){
    console.log("{client} connected!");
    io.emit('message',{message: 'socket connected!'});
});

io.listen(3000);