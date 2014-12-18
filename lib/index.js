var cheerio		 = require('cheerio');
	request 	 = require('request');
	async 		 = require('async');
	https 		 = require('https');

var SoundCrawler = function(url){
	this.music = url.replace('https', 'http');
	this.songId;
	this.useragent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
}

SoundCrawler.prototype.download = function(){
	console.log('test');
	async.series({
			songId: this.getSongId.bind(this),
			getUrl: this.getUrl.bind(this),
		}, function(err, results){
			if (err) console.log("ERRORS: " + err);
		});
};

SoundCrawler.prototype.getUrl = function(callback){
	var options = {
		url : 'https://api.soundcloud.com/i1/tracks/' + this.songId + '/streams?client_id=b45b1aa10f1ac2941910a7f0d10f8e28&app_version=077f83c',
		headers : {
			Accept : '*/*',
			'User-Agent' : this.useragent,
		}
	};
	request(options, function(error, response, html){
		console.log(html);
		if (!error && response.statusCode == 200){
			console.log(html);
			return callback(null, null);
		} else return callback(error, null);
	});
}

SoundCrawler.prototype.getSongId = function(callback){
	var options = {
		url : this.music,
		headers : {
			Accept : '*/*',
			'User-Agent' : this.useragent,
		}
	};
	request(options, function(error, response, html){
		if (!error && response.statusCode == 200){
			var $ = cheerio.load(html);
			$('script').filter(function(){
				var data = $(this).text();
				if (data.indexOf('webpackJsonp') > -1){
					this.songId = data.substring(data.indexOf('"stream_url')).split(',')[0].split('/')[4];
					return callback(null, null);
				}
			}.bind(this));
		} else { return callback({error: 'Request to page failed. ' + error}, null); }
	}.bind(this));
}

module.exports = SoundCrawler;

