function get(buf) {
    var Reader = function(buf) {
        this.index = 0;
        this.buffer = new DataView(buf);
    }
    Reader.prototype.readString8 = function() {
        var data = "";
        while (this.index <= this.buffer.byteLength) {
            var d = this.readUInt8();
            if (!d) break;
            data += String.fromCharCode(d);
        }
        return data;
    }
    Reader.prototype.readString16 = function() {
        var data = "";
        while (this.index <= this.buffer.byteLength) {
            var d = this.readUInt16BE();
            if (!d) break;
            data += String.fromCharCode(d);
        }
        return data;
    }
    Reader.prototype.readString32 = function() {
        var data = "";
        while (this.index <= this.buffer.byteLength) {
            var d = this.readUInt32BE();
            if (!d) break;
            data += String.fromCharCode(d);
        }
        return data;
    }
    Reader.prototype.readUInt8 = function() {
        return this.buffer.getUint8(this.index++);
    }
    Reader.prototype.readUInt16BE = function() {
        var data = this.buffer.getUint16(this.index);
        this.index += 2;
        return data;
    }
    Reader.prototype.readUInt32BE = function() {
        var data = this.buffer.getUint32(this.index);
        this.index += 4;
        return data;
    }

    var reader = new Reader(buf);
    var data1;

    var data1 = {};
    data1.timestamp = reader.readUInt32BE() - 1319538818;
    data1.id = reader.readString8();
    var len2 = reader.readUInt8();
    var data2 = [];
    for (var i2 = 0; i2 < len2; i2++) {
        var data3 = {};
        data3.username = reader.readString8();
        data3.y = reader.readUInt16BE() - 43824;
        data3.id = reader.readString8();
        data3.x = reader.readUInt16BE() - 28829;
        data3.angle = reader.readUInt16BE() - 54670;
        data2.push(data3);
    }
    data1.players = data2;
    data1.tick = reader.readUInt32BE() - 1321263712;
    return data1;
}