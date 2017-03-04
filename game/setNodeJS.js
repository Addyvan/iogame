module.exports = {
    set: function(data1) {
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

        byteLen += 1 + data1.id.length * 1;
        var data2 = data1.players;
        ++byteLen
        for (var i2 = 0; i2 < data2.length; i2++) {
            var data3 = data2[i2];
            byteLen += 1 + data3.username.length * 1;
            byteLen += 1 + data3.id.length * 1;
            byteLen += 6;
        }
        byteLen += 8;
        var writer = new Writer(byteLen);
        writer.writeUInt32BE(data1.timestamp + 1319538818);
        writer.writeString8(data1.id);
        var data2 = data1.players;
        var len2 = data2.length
        writer.writeUInt8(len2)
        for (var i2 = 0; i2 < len2; i2++) {
            var data3 = data2[i2];
            writer.writeString8(data3.username);
            writer.writeUInt16BE(data3.y + 43824);
            writer.writeString8(data3.id);
            writer.writeUInt16BE(data3.x + 28829);
            writer.writeUInt16BE(data3.angle + 54670);
        }
        writer.writeUInt32BE(data1.tick + 1321263712);
        return writer.toBuffer();
    }
};