/*
    The player class
    
    TODO put all the values into the config file
    useful read on classes in node: http://book.mixu.net/node/ch6.html
*/


//Constructor
function Player(args){
    //initialize variables

    this.id=args.id;
    if(args.username===undefined||args.username==""){
        this.username="a rando train";
    }
    else{
        this.username=args.username;
    }
    this.team= undefined;

    //state
    this.dead=1;
    this.hp=0;
    this.x=0;
    this.y=0;

    //actions
    this.turning=0;
    this.accelerating=0;

    //stats
    //this.maxhealth


    //snapshot data is used so that we only have to send some of the data
    this.snapshot_data={};

}

//class methods

Player.prototype.tick = function(){
    // this function is called every tick for each player to update their game state

};

Player.prototype.spawn = function(){
    //spawns the player which uses the map to set their coords
    // also resets various values


    this.dead =0;

};

module.exports = Player;