var url = ['https://soundcloud.com/delicieuse-musique/delicast-001-luvless',
'https://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost-you-feat-dangelo-lacy'];
var soundcrawler = require('./lib/app/index.js');
var async = require('async');

async.map(url, function(url){
	var crawler = new soundcrawler();
	crawler.download(url, function(err){
		if (err) console.log(err);
		else console.log(crawler.downloadURL);
	});
}, function(err, results){
	if (err) console.log(err);
	else console.log(results);
});
