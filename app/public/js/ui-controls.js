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

    window.timer_loop_handle = setInterval(update_timer,1000)
    UI_ACTIVE=1;
}

var deactivate_ui= function(){
    // turn off the ui ( don't focus chat ect)
    if(!UI_ACTIVE) return;

    clearInterval(window.timer_loop_handle) // stop updating the timer
    UI_ACTIVE=0;
}



var update_leaderboard=function(leaderboardList){
    // update the leaderboard
    cTable= $('#leaderboard-t-body')
    cTable.html('');
    $.each(leaderboardList, function(i)
    { 
      
      row= $('<tr/>');
      $('<td/>').text(i+1).appendTo(row);
      $('<td/>').text(leaderboardList[i][0].substring(0, 15)).appendTo(row);
      $('<td/>').text(leaderboardList[i][1]).appendTo(row);
      row.appendTo(cTable);
    });
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

parse_round_info = function(roundInfo){
  // currently the only round info so far is round end
  ROUND_END=roundInfo.roundEndTime
}

update_timer= function(){
  //https://www.w3schools.com/howto/howto_js_countdown.asp
  
  $("#round-time").text("") // erase the timer
  
  if (ROUND_END=== undefined) return


  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = ROUND_END - now;
  // Time calculations for days, hours, minutes and seconds
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (distance < 0) {
    clearInterval(window.timer_loop_handle);
    $("#round-time").text( "0:00")
  }else{
    if(seconds<10){
      $("#round-time").text( minutes + ":0" + seconds)
    }else{
      $("#round-time").text( minutes + ":" + seconds)
    }
    
  }
  
}