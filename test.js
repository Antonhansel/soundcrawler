var url = 'https://soundcloud.com/otgenasis/coco';
var soundcrawler = require('./index.js');

var crawler = new soundcrawler();
crawler.download(url, function(err){
    if (err) console.log(err);
    else {
    console.log(crawler.downloadURL);
    console.log(crawler.songId);
    }
});