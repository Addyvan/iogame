/*
    The map class parses a map file and oversees deciding spawn locations
    as well as overseeing the rail based movement system.

    the map is not loaded in the constructor so that it is easy to change maps between rounds

    This class takes a TILED map json file
    the following layers are parsed:
        -tracks
    
    a given tile id is mapped to a list showing what options are available 
    for take coming from North East West South (NEWS) either [left,straight,right] 

    TODO:
        -add spawns layer
        -should maybe be more robust
*/


//Constructor
function Gmap(){
    this.map_name=undefined;
    this.data=undefined;
    this.height=undefined;
    this.width=undefined;

    this.spawns=undefined; //TODO

}

//public variables

// there are likely mistakes in this since I did it by hand
var tile_graph_dict={
    1069:[0,[0,1,0],[0,1,0],0], // straight horinzontal
    1126:[[0,1,0],0,0,[0,1,0]], // straight vertical

    1067:[0,[1,0,0],0,[0,0,1]], // corner S-E
    1068:[0,0,[0,0,1],[1,0,0]], // corner S-W
    1124:[[1,0,0],[0,0,1],0,0], // corner N-E
    1125:[[0,0,1],0,[1,0,0],0], // corner N-W

    1071:[0,[1,1,0],[0,1,0],[0,0,1]], // horizontal with corner S-E
    1072:[0,[0,1,0],[0,1,1],[1,0,0]], // horizontal with corner S-W
    1128:[[1,0,0],[0,1,1],[0,1,0],0], // horizontal with corner N-E
    1129:[[0,0,1],[0,1,0],[1,1,0],0], // horizontal with corner N-W

    1067:[[0,1,0],[1,0,0],0,[0,1,1]], // vertical with corner S-E
    1068:[[0,1,0],0,[0,0,1],[1,1,0]], // vertical with corner S-W
    1124:[[1,1,0],[0,0,1],0,[0,1,0]], // vertical with corner N-E
    1125:[[0,1,1],0,[1,0,0],[0,1,0]], // vertical with corner N-W

    1299:[[0,1,0],[0,1,0],[0,1,0],[0,1,0]] //crossroads
};

//class methods
Gmap.prototype.load= function(map_json_name){
    // load and parse a map_json file
    this.map_name=map_json_name;

    map_json= require(__dirname+"/../public/assets/"+map_json_name); //TODO make this more robust
    this.width= map_json["width"];
    this.height= map_json["height"];

    for(var i=0, len=map_json["layers"].length;i<len;i++ ){
        if(map_json["layers"][i]["name"]=="tracks"){
            console.log("found!");
            this.data=map_json["layers"][i]["data"];
        }
    }
};

Gmap.prototype.spawn = function(team=0){
    // spawn the player at a spawn point according to their team
    //TODO
};

Gmap.prototype.move = function(player){
    // handle player movement
    tile_x=Math.floor(player.x);
    tile_y=Math.floor(player.y);
    var player_tile = this.data[tile_y*this.width +tile_x%this.width];
    valid_moves= tile_graph_dict[player_tile];
    if (valid_moves===undefined){
        console.log("WARNING undefined tile in map_class.js");
    }

    if(player.midturn==0){
        // check to see if a turn should be initiated
        if(player.turning!=1 && valid_moves[player.heading][player.turning]){
            //the player wants to turn and can
            player.midturn=player.turning -1;
            player.new_heading= ( player.heading + (player.turning-1) ) %4;
            player.progress=0; //TODO this should be set to their actual progress
        }
        if(player.turning==1 && !valid_moves[player.heading][player.turning]){
            //the player wants to go straight and can't
            player.midturn=1;
            player.new_heading= ( player.heading + (valid_moves[player.heading].indexOf(1)-1) ) %4;
            player.progress=0;
        }
    }

    if(player.midturn==0){
        //go straight
        player.x+=player.direction[0]*player.speed;
        player.y+=player.direction[1]*player.speed;
    }
    else{
        //turn
        // a turn is only 80% the length as going straight
        player.progress+=player.speed;
        player.x= tile_x + 2*Math.sin((0.8/player.progress)*90*player.midturn + player.heading*90)
        player.y= tile_y + 2*Math.cos((0.8/player.progress)*90*player.midturn + player.heading*90)
    }

};




module.exports=Gmap;