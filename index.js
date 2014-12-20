var cheerio		 = require('cheerio');
	request 	 = require('request');
	async 		 = require('async');
	http 		 = require('http');
	fs			 = require('fs');

var SoundCrawler = function(){
	this.music;
	this.songId;
	this.downloadURL;
	this.artist;
	this.title;
	this.useragent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
}

SoundCrawler.prototype.download = function(url, callback){
	this.music = url.replace('https', 'http');
	async.series({
		songId: this.getSongId.bind(this),
		getUrl: this.getUrl.bind(this),
		fetchFile: this.fetchFile.bind(this),
	}, callback);
};

SoundCrawler.prototype.fetchFile = function(callback){
	var file = fs.createWriteStream("./file.mp3");
	var options = {
		url : this.downloadURL.replace('https', 'http'),
		headers : {
			Accept : '*/*',
			'User-Agent' : this.useragent,
		},
		encoding: null,
		rejectUnauthorized : false,
		agent : new http.Agent(options),
	};
	console.log(options.url);

	request.get(options, function(err, response){
	}).on('error', function(error){
		console.log(error);
	}).pipe(file);
}

SoundCrawler.prototype.getUrl = function(callback){
	var options = {
		url : 'https://api.soundcloud.com/i1/tracks/' + this.songId + '/streams?client_id=b45b1aa10f1ac2941910a7f0d10f8e28&app_version=7530666',
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
					this.songId = data.substring(data.indexOf('","id":')).split(':')[1].split(',')[0];
					return callback();
				}
			}.bind(this));
		} else { return callback({error: 'Request to page failed. ' + error}, null); }
	}.bind(this));
}

module.exports = SoundCrawler;

