/*
    The train car class

    the train car can be attached to other cars to form a chain
    
    TODO put all the values into the config file

    TODO make the cars not decouple from the train

    car types:
        0- misc car
        1- engine
*/


//Constructor
function Car(args={}){
    this.player=undefined;
    this.x=undefined;
    this.y=undefined;
    this.angle=0;
    this.type=0;
    this.turning=1;
    this.heading=undefined;
    this.midturn=0;
    this.last_heading=undefined;
    this.progress=0;
    this.speed=0;
    this.attached_front=undefined;
    this.attached_back=undefined;
    this.next_tile=undefined;
    this.last_turn=undefined;
    this.snapshot_data={};
    this.game=undefined;
    this.next_turn=undefined; // TODO
    this.reversing=0;

    //this.prep_snapshot();
}

var headings_to_vector={
    //TODO put this in some sort of Utils file?
    0:[0,-1], //north
    1:[1,0], //east
    2:[0,1], //south
    3:[-1,0] //west
};

// class methods


Car.prototype.prep_snapshot = function(){
    //http://stackoverflow.com/questions/16880418/javascript-pass-object-as-reference
    //super important , js passes by copy reference so we can't reassign the object!
    /*
    //this way is bad and won't work!
    this.snapshot_data={
                        x:this.x,
                        y:this.y,
                        angle:this.angle,
                        type:this.type
        };

    */

    //this way will!
    this.snapshot_data.x= Math.round(this.x*100);
    this.snapshot_data.y= Math.round(this.y*100);
    this.snapshot_data.angle= Math.round(this.angle);
    this.snapshot_data.type= this.type;


    // call the next car which will call the next car and so on...
    if(this.attached_back != undefined){
        this.attached_back.prep_snapshot();
    }
};

Car.prototype.get_turn = function(){
    // get the cars action
    if(this.attached_front=== undefined||this.speed<0) return 1; //go straight

    return this.attached_front.last_turn;
};



Car.prototype.update_position = function(){
    if(this.attached_front=== undefined){
        // the car is unattached
        this.speed*=0.99;
    }
    else{
        this.speed=this.attached_front.speed;
    }

    if(this.speed<0 && !this.reversing){
        this.reversing=1;
        this.progress=0.99-this.progress;
    }

    if(this.speed>0 && this.reversing){
        this.reversing=0;
        this.progress=0.99-this.progress;
    }


    this.game.map.move(this);

    
    this.turning= this.get_turn();// this has to be done after moving but also in proper order
    // call the next car
    if(this.attached_back != undefined){
        this.attached_back.update_position();
    }
    
};

Car.prototype.attach = function(target){
    // attach the car to another car
    this.attached_front=target;
    this.game=target.game;

    target.attached_back=this;

    this.heading= target.last_heading;
    this.last_heading= target.last_heading;// MAJOR TODO, if the track isn't straight it will cause an error
    this.progress=target.progress;
    console.log(target.heading);
    this.x= target.x -headings_to_vector[target.heading][0];
    this.y= target.y -headings_to_vector[target.heading][1];

    if(target.attached_front){
        this.player = target.player;
    }
    else{
        this.player=target;
    }
    this.player.snapshot_data.cars.push(this.snapshot_data);
};


module.exports = Car;