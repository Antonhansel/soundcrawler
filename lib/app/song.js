var Song = require('./models/song.js');

exports.incrementDownloads = function(song, callback){
	console.log('Where we increment downloads');
	callback();
}