//wait for the page to load before starting
window.onload = function() {
    var play_button = document.getElementById("play-button");
    play_button.onclick = function() {
        connect_to_socket();
    };
};

connect_to_socket= function(){
    var socket = io.connect('http://localhost:3000');
    socket.on('message', function (data) {
        alert(data.message);
    });
};