/*
    This file contains the server game loop class
    I'm making this a class in case multiple games need to be run simultaneously
    
    requires the player class to be loaded
*/

//Constructor
function Game_loop(){
    //intialize variables
    this.tick=0;
    this.timestamp=undefined;

    this.players=[];
    this.world={};
    this.map=undefined;
}


//class methods
Game_loop.prototype.step = function(){
    // this function is called every tick and runs the game


    for (var i = 0, len = this.players.length; i < len; i++) {
        this.players[i].tick();
    }

    //increment the game tick and set the timestamp
    this.tick= (this.tick+1)%100000;
    this.timestamp = undefined; // TODO

    if(this.tick%100===1) console.log(`GAME TICK: ${this.tick }`);


};

Game_loop.prototype.start = function(){
    // this function starts the game loop. there is no function to end it presently
    //http://stackoverflow.com/questions/10129363/javascript-class-this-method-called-with-setinterval
    //this behaves very strangely in js apparently
    myobj= this;
    setInterval(function() {myobj.step();}, 1000 / 60);

};

Game_loop.prototype.add_player = function(id, query){
    // add a player to the list of players
    console.log(`${query.username } is joining the game`);
    this.players.push(new Player({id:id,username:query.username }));
};

Game_loop.prototype.remove_player = function(id){
    // remove a player from the list of players
    for (var i = 0, len = this.players.length; i < len; i++) {
        if(this.players[i].id==id){
            this.players.splice(i,1);
            break;
        }
    }
};
module.exports= Game_loop;