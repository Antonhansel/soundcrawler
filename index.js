var soundcrawler = require('./lib/index.js');

var url = 'https://soundcloud.com/delicieuse-musique/delicast-001-luvless';
var crawler = new soundcrawler(url);
crawler.download();