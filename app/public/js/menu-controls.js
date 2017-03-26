
// monitors whether the game is displaying or not so that we don't waste resources doing things that aren't being shown
game_displaying=false;

var show_game = function(){
    if(game_displaying) return;
    //googletag.pubads().refresh();

    start_game() // this function is in setup.js
    
    if(USERNAME!= $("#username").val()){
        send_username($("#username").val()) // in networking.js
    }

    $("#game-wrapper").css({ "display": ""});
    $("#game-ui-wrapper").css({ "display": ""});
    $("#menu-wrapper").css({ "display": "none"});


    // start the game, this will also start listening to keys for the game
    

    game_displaying=true;

};

var hide_game = function(){
    if(!game_displaying) return;

    $("#game-wrapper").css({ "display": "none"});
    $("#game-ui-wrapper").css({ "display": "none"});
    $("#menu-wrapper").css({ "display": ""});

    // stop the game, this will also stop listening to keys for the game
    stop_game() // this function is in setup.js

    game_displaying=false;
};


bind_actions= function(){
    //function to bind all the menu functions to their appropriate events this is a seperate function in case we need something to load first
    $("#play-button").bind("click",show_game);
    $("#usernameSelect").bind("submit",show_game);
}

set_username=function(username){
    // this is called by the socket handler
    USERNAME= username
    console.log("your username is ", USERNAME, "!")
}