function get (buf) {
  var Reader = function (buf) {
    this.index = 0
    this.buffer = new DataView(buf)
  }
  Reader.prototype.readString8 = function () {
    var data = ''
    while (this.index <= this.buffer.byteLength) {
      var d = this.readUInt8()
      if (!d) break
      data += String.fromCharCode(d)
    }
    return data
  }
  Reader.prototype.readString16 = function () {
    var data = ''
    while (this.index <= this.buffer.byteLength) {
      var d = this.readUInt16BE()
      if (!d) break
      data += String.fromCharCode(d)
    }
    return data
  }
  Reader.prototype.readString32 = function () {
    var data = ''
    while (this.index <= this.buffer.byteLength) {
      var d = this.readUInt32BE()
      if (!d) break
      data += String.fromCharCode(d)
    }
    return data
  }
  Reader.prototype.readUInt8 = function () {
    return this.buffer.getUint8(this.index++)
  }
  Reader.prototype.readUInt16BE = function () {
    var data = this.buffer.getUint16(this.index)
    this.index += 2
    return data
  }
  Reader.prototype.readUInt32BE = function () {
    var data = this.buffer.getUint32(this.index)
    this.index += 4
    return data
  }

  var reader = new Reader(buf)
  var data1

  var data1 = {}
  data1.tick = reader.readUInt32BE() - 521332116
  data1.id = reader.readString8()
  var len2 = reader.readUInt8()
  var data2 = []
  for (var i2 = 0; i2 < len2; i2++) {
    var data3 = {}
    data3.id = reader.readString8()
    data3.username = reader.readString8()
    var len4 = reader.readUInt8()
    var data4 = []
    for (var i4 = 0; i4 < len4; i4++) {
      var data5 = {}
      data5.y = reader.readUInt16BE() - 45865
      data5.x = reader.readUInt16BE() - 5801
      data5.type = reader.readUInt8() - 135
      data5.angle = reader.readUInt16BE() - 2234
      data4.push(data5)
    }
    data3.cars = data4
    data2.push(data3)
  }
  data1.players = data2
  data1.timestamp = reader.readUInt32BE() - 2785872083
  return data1
}
