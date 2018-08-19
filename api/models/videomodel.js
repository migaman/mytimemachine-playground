"use strict";

var schemaObject = require('schema-object');

var videomodel = new schemaObject({
	idvideo: Number,
	secretKey: String,
	releaseDateTime: Number,
	releaseBlock: Number,
	ethValue: Number,
	authorAddress: String,
	isAvailable: Boolean
});

module.exports = videomodel;
