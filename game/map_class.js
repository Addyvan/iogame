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
// ORDERED in N E S  W 
var tile_graph_dict={

    0:[[1,1,1],[1,1,1],[1,1,1],[1,1,1]], //TODO figure out a solution to account for off rail movement

    1069:[0,[0,1,0],0,[0,1,0]], // straight horinzontal
    1126:[[0,1,0],0,[0,1,0],0], // straight vertical

    1068:[[1,0,0],[0,0,1],0,0], // corner S-W
    1067:[[0,0,1],0,0,[1,0,0]], // corner S-e
    1125:[0,[1,0,0],[0,0,1],0], // corner N-W
    1124:[0,0,[1,0,0],[0,0,1]], // corner N-e

    1072:[[1,0,0],[0,1,1],0,[0,1,0]], // horizontal with corner S-W
    1071:[[0,0,1],[0,1,0],0,[1,1,0]], // horizontal with corner S-e
    1129:[0,[1,1,0],[0,0,1],[0,1,0]], // horizontal with corner N-W
    1128:[0,[0,1,0],[1,0,0],[0,1,1]], // horizontal with corner N-e

    1186:[[1,1,0],[0,0,1],[0,1,0],0], // vertical with corner S-W
    1185:[[0,1,1],0,[0,1,0],[1,0,0]], // vertical with corner S-e
    1243:[[0,1,0],[1,0,0],[0,1,1],0], // vertical with corner N-W
    1242:[[0,1,0],0,[1,1,0],[0,0,1]], // vertical with corner N-e

    1299:[[0,1,0],[0,1,0],[0,1,0],[0,1,0]] //crossroads
};

var headings_to_vector={
    0:[0,-1], //north
    1:[1,0], //east
    2:[0,1], //south
    3:[-1,0] //west
};

var start_point={
    // where to start turn arcs on the tile
    0:[0.5,1],       //north 
    1:[0,0.5],       //east 
    2:[0.5,0],       //south 
    3:[1,0.5]       //west 
};
var turn_operation={
    // - or + based on whether the turn path is coming from begining or end of tile
    0:-1,       //north 
    1:1,       //east 
    2:1,       //south 
    3:-1       //west 

}

var heading_to_angle={
    0:270,       //north 
    1:0,       //east 
    2:90,       //south 
    3:180       //west 
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
    //console.log(player.x,player.y);

    // keep the player in bounds
    if( player.x < 0) player.x =0;
    if( player.x > this.width)player.x =this.width-0.2; 
    if( player.y < 0 ) player.y =0;
    if( player.y > this.height)player.y =this.height-0.2;


    tile_x=Math.floor(player.x);
    tile_y=Math.floor(player.y);




    var player_tile = this.data[tile_y*this.width +tile_x%this.width]; 
    if (player_tile!=0)player_tile--;//  due to the first gid in the tiled format, this could break with multiple tilesets TODO make robust

    valid_moves= tile_graph_dict[player_tile];
    if (valid_moves===undefined){
        console.log("WARNING undefined tile in map_class.js, " + player_tile);
        console.log(player.x,player.y);
    }

    if(player.midturn==0){
        // check to see if a turn should be initiated
        //console.log(player.heading,player.turning);
        //console.log(valid_moves);

        if(player.turning!=1 && valid_moves[player.heading][player.turning]){
            //the player wants to turn and can
            player.midturn=player.turning -1;
            player.progress=0; //TODO this should be set to their actual progress
            console.log("turn initiated by press!");
        }
        if(!valid_moves[player.heading][1]){
            //the player wants to go straight and can't
            player.midturn= valid_moves[player.heading].indexOf(1)-1;
            player.progress=0;
            console.log("turn initiated by necessity!");
        }
    }

    if(player.midturn==0){
        //go straight
        //console.log("straight!");
        player.angle=heading_to_angle[player.heading];
        player.direction= headings_to_vector[player.heading];
        player.x+=player.direction[0]*player.speed;
        player.y+=player.direction[1]*player.speed;
    }
    else{
        //turn
        //console.log("turning!");
        // a turn is only 80% the length as going straight
        player.progress+=player.speed;
        player.x= tile_x +start_point[player.heading][0] + player.progress/0.75 *0.5*(headings_to_vector[player.heading][0] + headings_to_vector[(player.heading + player.midturn +4)%4][0] );// the +4 is bc js modulo sucks
        player.y= tile_y +start_point[player.heading][1] + player.progress/0.75 *0.5*(headings_to_vector[player.heading][1] + headings_to_vector[(player.heading + player.midturn+4)%4][1] );
        /*
        player.x= tile_x +start_point[player.heading][0] + 0.5*Math.sin((0.8/player.progress)*Math.PI*0.5*(-1)*player.midturn + (player.heading-1)*Math.PI*0.5);
        player.y= tile_y +start_point[player.heading][1]+ 0.5*Math.cos((0.8/player.progress)*Math.PI*0.5*(-1)*player.midturn + (player.heading-1)*Math.PI*0.5);
        */
        player.angle= (heading_to_angle[player.heading] + player.midturn*90*player.progress/0.8)%360;
        if (player.progress>0.8){
            player.progress=0;
            player.heading=  (player.heading + player.midturn +4)%4;// important to turn the train!
            player.midturn=0; //important to end the turn! ...... after you change the heading lol
            //console.log("turn complete!");
        }
        else {
            // don't exit tile by a rounding error
            //console.log(player.x,player.y);
            player.x= Math.min(Math.max(tile_x,player.x),tile_x+0.99);
            player.y= Math.min(Math.max(tile_y,player.y),tile_y+0.99);
        }
    }

    

};




module.exports=Gmap;