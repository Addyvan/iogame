/* this file handles ui elements such as the leaderboard and chat

*/
UI_ACTIVE=0;
TEXT_MODE=false;

var activate_ui=function(){
    // activate the in game ui
    if(UI_ACTIVE) return;
    console.log("activating game ui")

    $( "#message" ).click(function() {
        console.log("message form clicked!")
        $("#message").focus();
    });

    $("#message").focus(function(){
        TEXT_MODE=true;
    });
    $("#message").focusout(function(){
        TEXT_MODE=false;
    });


    UI_ACTIVE=1;
}

var deactivate_ui= function(){
    // turn off the ui ( don't focus chat ect)
    // unclear if this will even be needed
    if(!UI_ACTIVE) return;


    UI_ACTIVE=0;
}



var update_leaderboard=function(){
    // update the leaderboard
}


var parse_message=function(packet){
    //parse a message from the socket
   
   cTable = $('#messages-t-body');
   row= $('<tr/>');
   $('<td/>').text(packet.user).css({"font-weight":"heavy","word-wrap": "break-word"}).addClass("chat-user").appendTo(row);
   $('<td/>').text(":"+packet.message).css({"word-wrap": "break-word"}).addClass("chat-message").appendTo(row);

   row.appendTo(cTable);

   // remove extra elements
   if($('#messages-t-body tr').length >12 ) {
        $('#messages-t-body tr').first().remove();
   }

   cTable.scrollTop(cTable.prop("scrollHeight"));
   console.log("message received!");
};



//todo implement anti-spam since some users will inevitebly be jerks and drown out conversations
// should be done server side
$("#message-form").submit( function(event){
    socket.emit('message',$("#message").val() )
    $("#message-form")[0].reset();
});
