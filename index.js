var url = 'https://soundcloud.com/delicieuse-musique/delicast-001-luvless';
var soundcrawler = require('./lib/app/index.js');
var crawler = new soundcrawler(url);

crawler.events.on('done', function(){
	console.log('address retrieved!: ' + crawler.downloadURL);
});

crawler.events.on('error', function(err){
	console.log(err);
});

crawler.download();