/*
    This is where all things audio are handled, other files can have triggers that call from this file
    -Andrew

    todo: make this load in all the sounds in a specified folder

    took code from this article
    https://www.html5rocks.com/en/tutorials/webaudio/intro/
*/
AUDIO_ENABLED=false;
SOUNDS={};
SOUND_URLS=["assets/audio/vapsquad_yellyguy_arena_round_start.wav"
            ];

function init_audio(){
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        window.audio_context = new AudioContext();
        AUDIO_ENABLED=true;
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        AUDIO_ENABLED=false;
    }
    setup_audio();
}

function setup_audio(){
    // load in the sounds and store them in a similar fashion to how we store the spritesheets
    for(i=0 ; i< SOUND_URLS.length;i++){
        load_sound(SOUND_URLS[i]);
    }
    
}

function load_sound(url){
    // load a sound

    xhrGet(url,function(data) { 
                            audio_context.decodeAudioData(data.response, function(buffer) {
                                                                            SOUNDS[url] = buffer;});
        }, 'arraybuffer');
}


function playSound(url) {
  if (SOUNDS[url]===undefined|| !AUDIO_ENABLED) return;
  var source = audio_context.createBufferSource(); // creates a sound source
  
  source.buffer = SOUNDS[url];                    // tell the source which sound to play
  source.connect(audio_context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}