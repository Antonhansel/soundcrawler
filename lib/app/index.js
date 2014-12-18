var cheerio		 = require('cheerio');
	request 	 = require('request');
	async 		 = require('async');
	https 		 = require('https');
	events 		 = require('events');

var SoundCrawler = function(url){
	this.music = url.replace('https', 'http');
	this.songId;
	this.downloadURL;
	this.useragent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
	this.events = new events.EventEmitter();
}

SoundCrawler.prototype.download = function(){
	async.series({
			songId: this.getSongId.bind(this),
			getUrl: this.getUrl.bind(this),
		}, function(err, results){
			if (err) this.events.emit('error', err);
			else this.events.emit('done');
		}.bind(this));
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
		if (!error && response.statusCode == 200){
			this.downloadURL = JSON.parse(html).http_mp3_128_url;
			return callback();
		} else return callback(error, null);
	}.bind(this));
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
			$('script').filter(function(i, el){
				var data = $(el).text();
				if (data.indexOf('webpackJsonp') > -1){
					this.songId = data.substring(data.indexOf('"stream_url')).split(',')[0].split('/')[4];
					return callback();
				}
			}.bind(this));
		} else { return callback({error: 'Request to page failed. ' + error}, null); }
	}.bind(this));
}

module.exports = SoundCrawler;

