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
            byteLen += 1 + data3.id.length * 1;
            byteLen += 1 + data3.username.length * 1;
            var data4 = data3.cars;
            ++byteLen
            for (var i4 = 0; i4 < data4.length; i4++) {
                var data5 = data4[i4];
                byteLen += 7;
            }
        }
        byteLen += 8;
        var writer = new Writer(byteLen);
        writer.writeUInt32BE(data1.tick + 521332116);
        writer.writeString8(data1.id);
        var data2 = data1.players;
        var len2 = data2.length
        writer.writeUInt8(len2)
        for (var i2 = 0; i2 < len2; i2++) {
            var data3 = data2[i2];
            writer.writeString8(data3.id);
            writer.writeString8(data3.username);
            var data4 = data3.cars;
            var len4 = data4.length
            writer.writeUInt8(len4)
            for (var i4 = 0; i4 < len4; i4++) {
                var data5 = data4[i4];
                writer.writeUInt16BE(data5.y + 45865);
                writer.writeUInt16BE(data5.x + 5801);
                writer.writeUInt8(data5.type + 135);
                writer.writeUInt16BE(data5.angle + 2234);
            }
        }
        writer.writeUInt32BE(data1.timestamp + 2785872083);
        return writer.toBuffer();
    }
};