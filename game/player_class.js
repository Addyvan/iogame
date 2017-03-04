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
    this.game= args.game;


    this.team= undefined;

    //state
    this.dead=1;
    this.hp=0;
    this.x=0;
    this.y=0;

    this.speed=1;
    this.heading=0; 
    this.new_heading=0; 
    this.direction=[1,0]; // also the angle of the train?
    this.midturn=0; // -1 ,0 , or 1 for left , not turning , or right 
    this.progress=0; // used to track progress through a tile

    //actions
    this.turning=1; //0 for left, 1 for straight, 2 for right
    this.accelerating=0;

    //stats
    //TODO move to config file
    this.max_health=100;
    this.accel_rate=0.01;
    this.max_speed=3;


    //snapshot data is used so that we only have to send some of the data
    this.snapshot_data={};

}

//class methods

Player.prototype.tick = function(){
    // this function is called every tick for each player to update their game state

};

Player.prototype.update_position = function(){
    // apply acceleration and update position

    this.game.map.move(this);
};

Player.prototype.spawn = function(){
    //spawns the player which uses the map to set their coords
    // also resets various values


    this.dead =0;

};


Player.prototype.parse = function(inputs){
    // parse player inputs

    if(inputs[0]){ //up
        this.accelerating=1;
    }
    else if(inputs[1]){ //down
        this.accelerating=-1;
    }
    else{
       this.accelerating=0; 
    }

    if(inputs[2]){//left
        this.turning=0;
    }
    else if(inputs[3]){ //right
        this.turning=2;
    }
    else{
        this.turning=1;
    }
};

module.exports = Player;