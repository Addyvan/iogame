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
    this.map=new Gmap();
    this.map.load("map.json"); //TODO put this into a new round function
    this.snapshot={tick:this.tick,
                    timestamp:this.timestamp,
                    id:"todo",
                    players:[]
                };

}


//class methods
Game_loop.prototype.step = function(){
    // this function is called every tick and runs the game


    for (var i = 0, len = this.players.length; i < len; i++) {
        this.players[i].tick();
    }

    //increment the game tick and set the timestamp
    this.tick= (this.tick+1)%100000;
    // 86400000 is # milliseconds in a day, apparently the timestamp was too big to fit in 4 bytes and that caused issues
    this.timestamp = Date.now()%86400000; // TODO figure out if this is the best method, also apparently node has higher res timing?
    this.prep_snapshot(); //atm only updates time/tick keeping in this function
    if(this.tick%100===1) console.log(`GAME TICK: ${this.tick }`);

    //console.log(this.snapshot);
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
    //CRITICAL TODO, findout whether or not this is passing a pointer or some crazy recursive copy
    new_player=new Player({id:id,username:query.username, game:this });
    this.players.push(new_player);
    this.snapshot.players.push(new_player.snapshot_data);
    return new_player;
};

Game_loop.prototype.remove_player = function(id){
    // remove a player from the list of players
    
    //remember to remove the player from the snapshot as well!
    // think this has to be first or we may end up with undefined troubles
    //http://stackoverflow.com/questions/7440001/iterate-over-object-keys-in-node-js


    for (var i = 0, len = this.snapshot.players.length; i < len; i++) {
        if(this.snapshot.players[i].id==id){
            this.snapshot.players.splice(i,1);
            break;
        }
    }

    for (var i = 0, len = this.players.length; i < len; i++) {
        if(this.players[i].id==id){
            this.players.splice(i,1);
            break;
        }
    }

};
Game_loop.prototype.prep_snapshot = function(){
    // update the snapshot
    this.snapshot.tick=this.tick;
    this.snapshot.timestamp=this.timestamp;

};


module.exports= Game_loop;