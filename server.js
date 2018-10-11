var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var ip = require('ip');
var dir = __dirname;
var postersPath = "/assets/posters/";
var trailersPath = "/assets/trailers/";
const harddisk = "H:/MOVIE";
var extensions = [".mp4", ".mkv"];

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    webvtt: 'text/vtt',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

app.use(express.static(path.join(__dirname, 'public')))

// app.get("/file/", function(req, res) {
// 	// res.send("Hello World");
// 	const fileChunk = fs
// })

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/trailer/*', function(req,res){
	res.sendFile(path.join(__dirname + '/trailer.html'))
})

app.get('/video/*', function(req, res){
	try {
		filename = decodeURI(req.params[0]);
		// console.log(filename);
		var filePath = path.join(harddisk, filename, filename);
		// console.log('filePath', filePath);
		for(var i = 0; i < extensions.length; i++) {
			var check = JSON.stringify(filePath);
			check = JSON.parse(check);
			check += extensions[i];

			// console.log('check', check);
			if(fs.existsSync(check)) {
				filePath = check;
				i = extensions.length;
			}
		}
		// console.log(fs.existsSync(filePath));

		if (fs.existsSync(filePath)) {
			const stat = fs.statSync(filePath);
			const fileSize = stat.size;
			const range = req.headers.range;

			if(range){
				const parts = range.replace(/bytes=/, "").split('-')
				const start = parseInt(parts[0], 10)
				const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1

				const chunksize = (end-start) + 1;
				const file = fs.createReadStream(filePath, {start, end})
				const head = {
					'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			      	'Accept-Ranges': 'bytes',
			      	'Content-Length': chunksize,
			      	'Content-Type': 'video/mp4',
			    }

			    res.writeHead(206, head);
			    file.pipe(res);
			} else {
				const head = {
					'Content-Length': fileSize,
		      		'Content-Type': 'video/mp4',
				}

				res.writeHead(200, head);
				fs.createReadStream(filePath).pipe(res)
			}
		} else {

		}
		
	}
	catch(e) {
		console.log(e);
	}
	
})

app.get('/gallery', function(req, res){
	
	// const path = __dirname + postersPath;
	const path = harddisk + postersPath;
	var loadFiles = getPosterFiles(path)
	var json = JSON.stringify(loadFiles);
	res.writeHead(200);
	res.end(json);
})



function getPosterFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(postersPath + files[i]);
        }
    }
    return files_;
}

app.get('/assets/posters/*', function (req, res) {
	// console.log(dir);
	var params = decodeURI(req.path);
    // var file = path.join(harddisk, params.replace(/\/$/, '/index.html'));
    var file = path.join(harddisk, params);
    file = decodeURI(file);
    // console.log(file);
    var hd = path.join(harddisk);
    if (file.indexOf(hd + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    // console.log(type);
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.get('/subtitle/*', function (req, res) {

	var params = decodeURI(req.params[0]);
    // var file = path.join(harddisk, params.replace(/\/$/, '/index.html'));
    var file = path.join(harddisk, params, params);
    file = decodeURI(file);
    file += ".webvtt";
    console.log('file', file);
    var hd = path.join(harddisk);
    if (file.indexOf(hd + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    console.log(type);
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
})