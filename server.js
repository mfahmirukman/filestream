
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const ip = require('ip');
const dir = __dirname;

const config = require("./config.js");
const configjson = require("./config.json");
const directory = require("./directory.js");


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res) {
	try {
		res.sendFile(path.join(__dirname + '/index.html'))
	}
	catch(e) {
		console.log(e);
		res.status(404).end();
	}
});

app.get('/trailer/*', function(req,res) {
	try {
		res.sendFile(path.join(__dirname + '/trailer.html'))
	}
	catch(e) {
		console.log(e);
		res.status(404).end();
	}
});

app.get('/video/*', function(req, res){
	directory.getVideos(req, res);
});

app.get('/gallery/', function(req, res) {
	directory.getGallery(req, res);
});

app.get(config.postersPath.toLowerCase() + "*", function (req, res) {
	directory.getPosterFile(req, res);
});

app.get('/subtitle/*', function (req, res) {
	directory.getSubtitles(req, res);
});

app.get('/config/', function(req, res) {
 	res.status(200).end(JSON.stringify(configjson));
})

var server = app.listen(80, function(){
	try {
		var host = server.address().address;
		var port = server.address().port;
		
		var string = "Example app listening at http://%s";
		if(port == 80) {
			console.log(string, ip.address());
		} else {
			string += ":%s";
			console.log(string, ip.address(), port);
		}
	}
	catch(e) {
		console.log(e);
		res.status(404).end();
	}
	
})