var cheerio		 = require('cheerio');
	request 	 = require('request');
	async 		 = require('async');
	http 		 = require('http');
	fs			 = require('fs');

var SoundCrawler = function(){
	this.music;
	this.songId;
	this.downloadURL;
	this.title;
	this.fileName;
	this.app_version;
	this.toDownload;
	this.useragent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
}

SoundCrawler.prototype.download = function(url, download, callback){
	if (callback === undefined){
		callback = download
		this.toDownload = false;
	}
	this.toDownload = download;
	this.music = url.replace('https', 'http');
	async.series({
		songId: this.getSongDetails.bind(this),
		getUrl: this.getUrl.bind(this),
		fetchFile: this.fetchFile.bind(this),
	}, function(err){
		if (err) callback(err);
		else callback();
	});
};

SoundCrawler.prototype.fetchFile = function(callback){
	this.fileName = this.title.replace(/\s/g, '_');
	this.fileName = this.fileName.replace(/\W/g, '');
	if (this.toDownload == true){
		var file = fs.createWriteStream("./" + this.fileName + ".mp3");
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
		request.get(options, function(err, response){
		}).on('error', function(error){
			callback(error);
		}).on('end', function(){
			callback();
		}.bind(this)).pipe(file);
		}
	else callback();
}

SoundCrawler.prototype.getUrl = function(callback){
	var options = {
		url : 'https://api.soundcloud.com/i1/tracks/' + this.songId + '/streams?client_id=b45b1aa10f1ac2941910a7f0d10f8e28&app_version=' + this.app_version,
		headers : {
			Accept : '*/*',
			'User-Agent' : this.useragent,
		}
	};
	request(options, function(error, response, html){
		if (!error && response.statusCode == 200){
			this.downloadURL = JSON.parse(html).http_mp3_128_url;
			if (this.downloadURL == undefined)
				return (callback({'error' : 'Cannot generate download url for ' + this.title})); 
			return callback();
		} else return callback(error);
	}.bind(this));
}

SoundCrawler.prototype.getSongDetails = function(callback){
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
			$('title').filter(function(i, el){
				this.title = $(el).text().split('- Hear')[0];
			}.bind(this));
			$('script').filter(function(i, el){
				var data = $(el).text();
				if (data.indexOf('window.__sc_version = "') > -1){
					this.app_version = data.split('"')[1].split('"')[0];
				}
				if (data.indexOf('webpackJsonp') > -1){
					this.songId = data.substring(data.indexOf('","id":')).split(':')[1].split(',')[0];
				}
			}.bind(this));
			return callback();
		} else { return callback({error: 'Request to page failed. ' + error}); }
	}.bind(this));
}

module.exports = SoundCrawler;

