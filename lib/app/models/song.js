var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	title : 	 String,
	artist : 	 String,
	pageUrl : 	 String,
	songUrl : 	 String,
	downloaded : Number,
	lastUpdate : Date,
});

module.exports = mongoose.model('Song', songSchema);
