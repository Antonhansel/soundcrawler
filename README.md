SoundCrawler
===================

**SoundCrawler** is a npm module that can retrieve the file address of any song on SoundCloud.

Git url : https://github.com/Antonhansel/soundcrawler

----------

    var url = 'https://soundcloud.com/delicieuse-musique/delicast-001-luvless';
    var soundcrawler = require('soundcrawler');
    
	var crawler = new soundcrawler();
	crawler.download(url, function(err){
	    if (err) console.log(err);
	    else {
	    console.log(crawler.downloadURL);
	    console.log(crawler.songId);
	    }
	});