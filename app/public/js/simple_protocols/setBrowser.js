function set(data1) {
    function Writer(size) {
        this.buf = new ArrayBuffer(size);
        this.buffer = new DataView(this.buf);
        this.index = 0;
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
        this.buffer.setUint8(this.index++, n)
    }
    Writer.prototype.writeUInt16BE = function(n) {
        this.buffer.setUint16(this.index, n)
        this.index += 2;
    }
    Writer.prototype.writeUInt32BE = function(n) {
        this.buffer.setUint32(this.index, n)
        this.index += 4;
    }
    Writer.prototype.toBuffer = function() {
        return this.buf;
    }

    var byteLen = 0;

    var data2 = data1.actions;
    for (var i2 = 0; i2 < 5; i2++) {
        var data3 = data2[i2];
        byteLen += 1;
    }
    var data2 = data1.mouse;
    byteLen += 4;
    var writer = new Writer(byteLen);
    var data2 = data1.actions;
    for (var i2 = 0; i2 < 5; i2++) {
        var data3 = data2[i2];
        writer.writeUInt8(data3);
    }
    var data2 = data1.mouse;
    writer.writeUInt16BE(data2.y + 330);
    writer.writeUInt16BE(data2.x + 468);
    return writer.toBuffer();
}