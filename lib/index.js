var cheerio		 = require('cheerio');
	request 	 = require('request');
	async 		 = require('async');
	https 		 = require('https');

var SoundCrawler = function(url){
	this.music = url.replace('https', 'http');
	this.songId;
}

SoundCrawler.prototype.download = function(){
	this.getSongId();
};

SoundCrawler.prototype.getSongId = function(){
	var options = {
		url : this.music,
		headers : {
			Accept : '*/*',
			'User-Agent' : 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
		}
	};
	request(options, function(error, response, html){
		if (!error && response.statusCode == 200){
			var $ = cheerio.load(html);
			$('script').filter(function(){
				var data = $(this).text();
				if (data.indexOf('webpackJsonp') > -1){
					this.songId = data.substring(data.indexOf('"stream_url')).split(',')[0].split('/')[4];
				}
			});
		}
	});
}

module.exports = SoundCrawler;

