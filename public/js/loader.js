/*
Load in scripts so that the page itself loads very quickly and we don't have to worry about load order for files

TODO: handle all assets loading, ie sounds,json,images 
*/


window.onload = function() {
    var scripts_loaded =0;
    var scripts=[
                "js/TILEDMapClass.js",
                "js/game.js",
                "js/globals.js",
                "js/setup.js",
                "js/utils.js",
                "js/3dsprite.js",
                "js/inputHandler.js",
                "js/simple_protocols/setBrowser.js",
                "js/simple_protocols/getBrowser.js"
                 ];
    for(i=0 ; i< scripts.length;i++){
        // todo add error handling
        $.getScript(scripts[i], function(){ if(++scripts_loaded>=scripts.length)setup();  } );
    }
    
    console.log("all scripts loaded");
};