/*
    handle chat between players, this file should not be tied to any game features so that it is hopefully reusable

    text should be sanitized and anti spam should be featured here

    is the socket accecisble from this file?
*/ 

function sanitizeMessage(message){
    // sanitize the message so that it is no longer than 200 characters and contains no undesirable characters
    //SERIOUS TODO
    if (message.length==0) return false
    return message.substring(0,200)
}

function sendMessage(message,user){
    this.io.in(this.channel).emit('message', {message:message,user:user})
}

function messageHandler(packet,user){
    // takes in the object passed
    message= this.sanitizeMessage(packet)
    if(message){
        this.sendMessage(message,user)
    }
    

}

function chatHandlerFactory (args){
    return {
        channel:'game', //todo make this more flexible for teamchat and lobbies ect
        io:args.io,
        sendMessage,
        messageHandler,
        sanitizeMessage
    }
}

module.exports = chatHandlerFactory