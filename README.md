SoundCrawler
===================

**SoundCrawler** is a npm module that can retrieve the file address of any song on SoundCloud.

Git url : https://github.com/Antonhansel/soundcrawler

----------

	var url = 'https://soundcloud.com/aboveandbeyond/abgt109';
	var soundcrawler = require('soundcrawler');

	var crawler = new soundcrawler();
	var download = true; //the second argument is optional. Pass it to true to download the file locally!
	crawler.download(url, download,function(err){
	    if (err) console.log("Error" + err);
	    else {
	    	console.log(crawler.downloadURL);
	    	console.log(crawler.title);
	    }
	});