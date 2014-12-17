var http         = require('http'),
	fs           = require('fs'),
	url          = require('url'),
	util         = require('util'),
	path         = require('path');

var SoundCrawler = function(url){
	url = url.replace('https', 'http');
	
}