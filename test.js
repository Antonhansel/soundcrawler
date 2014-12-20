var url = 'https://soundcloud.com/aboveandbeyond/abgt109';
var soundcrawler = require('./index.js');

var crawler = new soundcrawler();
crawler.download(url, false,function(err){
    if (err) console.log("Error" + err);
    else {
    	console.log(crawler.downloadURL);
    	console.log(crawler.title);
    }
});