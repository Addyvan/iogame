function set(data1) {
    function Writer(size) {
        this.index = 0;
        this.buffer = Buffer.alloc(size);
    }
    Writer.prototype.writeString8 = function(string) {
        for (var i = 0; i < string.length; i++) {
            this.writeUInt8(string.charCodeAt(i))
        }
        this.writeUInt8(0)
    }
    Writer.prototype.writeString16 = function(string) {
        for (var i = 0; i < string.length; i++) {
            this.writeUInt16BE(string.charCodeAt(i))
        }
        this.writeUInt16BE(0)
    }
    Writer.prototype.writeString32 = function(string) {
        for (var i = 0; i < string.length; i++) {
            this.writeUInt32BE(string.charCodeAt(i))
        }
        this.writeUInt32BE(0)
    }
    Writer.prototype.writeUInt8 = function(n) {
        this.buffer.writeUInt8(n, this.index++)
    }
    Writer.prototype.writeUInt16BE = function(n) {
        this.buffer.writeUInt16BE(n, this.index)
        this.index += 2;
    }
    Writer.prototype.writeUInt32BE = function(n) {
        this.buffer.writeUInt32BE(n, this.index)
        this.index += 4;
    }
    Writer.prototype.toBuffer = function() {
        return this.buffer;
    }

    var byteLen = 0;

    byteLen += 8;
    var writer = new Writer(byteLen);
    writer.writeUInt32BE(data1.timestamp + 1164309084);
    writer.writeUInt32BE(data1.tick + 3718057900);
    return writer.toBuffer();
}