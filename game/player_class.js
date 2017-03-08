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
    this.is_car=0;
    this.dead=1;
    this.hp=0;
    this.x=undefined;
    this.y=undefined;
    this.tile_x=9;
    this.tile_y=10.5;
    this.last_turn=0;//  0 ,1 or 2 for left ,didn't turn , or right 
    this.reversing=0;

    this.speed=0; 
    this.heading=undefined; 
    this.last_heading=undefined; 
    this.new_heading=0; 
    //this.direction=[0,1]; // also the angle of the train?
    this.midturn=0; // -1 ,0 , or 1 for left , not turning , or right 
    this.progress=0; // used to track progress through a tile

    //actions
    this.turning=1; //0 for left, 1 for straight, 2 for right
    this.accelerating=0;

    //stats
    //TODO move to config file
    this.max_health=100;
    this.accel_rate=0.05/60;
    this.max_speed=7/60; // you can fly off the tracks if this is too high


    //cars chain
    this.attached_back=undefined;


    //snapshot data is used so that we only have to send some of the data
    this.snapshot_data={id:this.id,
                        username:this.username,
                        x:0,
                        y:0,
                        angle:0,
                        cars:[]
                    };
    this.spawn();

}

//class methods

Player.prototype.tick = function(){
    // this function is called every tick for each player to update their game state
    this.update_position();
    this.prep_snapshot();
};

//////////////////////////////////////////////
// Calvin Tidied 7/03/17
//////////////////////////////////////////////
Player.prototype.update_position = function(){
    // apply acceleration and update position
    this.speed+= this.accel_rate*this.accelerating;

    if(this.speed < 0){
        if(!this.reversing){
            this.reversing = 1;
            this.progress=1-this.progress;
        }
        this.speed = Math.max(this.speed, -0.5*this.max_speed);
    }else if(this.speed > 0){
        if(this.reversing){
            this.reversing = 0;
            this.progress=1-this.progress;
        }
        this.speed = Math.min(this.speed, this.max_speed);
    }

    this.game.map.move(this);

    // call the next car which will call the next car and so on...
    if(this.attached_back){
        this.attached_back.update_position();
    }
};

////////////////////////////////////
// Calvin tidied 8/03/17
// Define # of cars to spawn in a loop
////////////////////////////////////
Player.prototype.spawn = function(){
    //spawns the player which uses the map to set their coords
    // also resets various values

    var init_num_cars = 10; // Move this guy somewhere meaningful
    
    console.log("spawning!");
    //console.log(this);
    this.dead =0;
    this.game.map.spawn_location(this);
 
    var CAR_ARR = new Array(new Car());
    
    CAR_ARR[0].attach(this);
    for(var x = 1; x < init_num_cars; x++){
        CAR_ARR.push(new Car());
        CAR_ARR[x].attach(CAR_ARR[x-1]);
    }

};
Player.prototype.prep_snapshot = function(){
    // set the snapshot data fields

    this.snapshot_data.x= Math.round(this.x*100);
    this.snapshot_data.y= Math.round(this.y*100);
    this.snapshot_data.angle= Math.round(this.angle); //TODO

    // call the next car which will call the next car and so on...
    if(this.attached_back != undefined){
        this.attached_back.prep_snapshot();
    }
    //console.log(this.snapshot_data);

};

Player.prototype.build_car_list= function(){
    //recursive function to build the car list for the snapshot
    //TODO didn't do this since it feel inneficient af
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

Player.prototype.RIP = function(){
    //RIP in peace
    //TODO

    //remove all cars


};

module.exports = Player;