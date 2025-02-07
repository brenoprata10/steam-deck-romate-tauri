'use strict'

function BufferReader(buffer) {
	buffer = buffer || new Buffer(0)
	this.buf = buffer
	this.offset = 0
}

BufferReader.prototype.append = function (buffer) {
	this.buf = Buffer.concat([this.buf, buffer])
	return this
}

BufferReader.prototype.tell = function () {
	return this.offset
}

BufferReader.prototype.seek = function (pos) {
	this.offset = pos
	return this
}

BufferReader.prototype.move = function (diff) {
	this.offset += diff
	return this
}

BufferReader.prototype.nextAll = BufferReader.prototype.restAll = function () {
	const remain = this.buf.length - this.offset
	const buf = new Buffer(remain)
	this.buf.copy(buf, 0, this.offset)
	this.offset = this.buf.length
	return buf
}

BufferReader.prototype.nextBuffer = function (length) {
	var buf = new Buffer(length)
	this.buf.copy(buf, 0, this.offset, this.offset + length)
	this.offset += length
	return buf
}

BufferReader.prototype.nextString = function (length, encoding) {
	this.offset += length
	return this.buf.toString(encoding, this.offset - length, this.offset)
}

BufferReader.prototype.nextStringZero = function (encoding) {
	// Find null by end of buffer
	for (var length = 0; length + this.offset < this.buf.length && this.buf[this.offset + length] !== 0x00; length++);

	this.offset += length + 1
	return this.buf.toString(encoding, this.offset - length - 1, this.offset - 1)
}

function MAKE_NEXT_READER(valueName, size) {
	valueName = cap(valueName)
	BufferReader.prototype['next' + valueName] = function () {
		var val = this.buf['read' + valueName](this.offset)
		this.offset += size
		return val
	}
}

function MAKE_NEXT_READER_BOTH(valueName, size) {
	MAKE_NEXT_READER(valueName + 'LE', size)
	MAKE_NEXT_READER(valueName + 'BE', size)
}

MAKE_NEXT_READER('Int8', 1)
MAKE_NEXT_READER('UInt8', 1)
MAKE_NEXT_READER_BOTH('UInt16', 2)
MAKE_NEXT_READER_BOTH('Int16', 2)
MAKE_NEXT_READER_BOTH('UInt32', 4)
MAKE_NEXT_READER_BOTH('Int32', 4)
MAKE_NEXT_READER_BOTH('Float', 4)
MAKE_NEXT_READER_BOTH('Double', 8)

function cap(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = BufferReader
