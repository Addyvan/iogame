/*
Client side utils

*/

function xhrGet(reqUri, callback,type ){
    var caller= xhrGet.caller;
    var xhr= new XMLHttpRequest();
    xhr.open("GET",reqUri,true);

    if(type) xhr.responseType=type;

    xhr.onload = function(){
        if(callback){
            try{
                callback(xhr);
            }catch(e){
                throw 'xhrGet failed:\n' +reqUri+ "\nException: "+e +'\n';
            }
        }
    };

    xhr.send();
}