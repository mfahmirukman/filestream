const config = require("./config.js");
const fs = require('fs');
const path = require('path');

const directory = {
	getPosterFile : function(req, res) {
		try {
			var params = decodeURI(req.path);
		    // var file = path.join(config.harddisk, params.replace(/\/$/, '/index.html'));
		    var file = path.join(config.harddisk, params);
		    file = decodeURI(file);
		    var hd = path.join(config.harddisk);
		    if (file.indexOf(hd) !== 0) {
		        return res.status(403).end('Forbidden');
		    }
		    var type = config.mime[path.extname(file).slice(1)] || 'text/plain';
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
		}
		catch(e) {
			console.log(e);
			res.status(404).end();
		}
	},
	getPosterFiles : function(dir, files_){
	    files_ = files_ || [];
	    var files = fs.readdirSync(dir);
	    for (var i in files){
	        var name = dir + '/' + files[i];
	        if (fs.statSync(name).isDirectory()){
	            getFiles(name, files_);
	        } else {
	            files_.push(config.postersPath + files[i]);
	        }
	    }
	    return files_;
	},

	getGallery : function(req, res) {
		try {
			const path = config.harddisk + config.postersPath;
			var loadFiles = directory.getPosterFiles(path)
			var json = JSON.stringify(loadFiles);
			res.status(200).end(json);
		}
		catch(e) {
			console.log(e);
			res.status(404).end();
		}
	},

	getVideos : function(req, res) {
		try {
			var filename = decodeURI(req.params[0]);
			var filePath = path.join(config.harddisk, filename, filename);
			
			for(var i = 0; i < config.fileExtensions.length; i++) {
				var check = JSON.stringify(filePath);
				check = JSON.parse(check);
				check += config.fileExtensions[i];

				if(fs.existsSync(check)) {
					filePath = check;
					i = config.fileExtensions.length;
				}
			}

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
				res.status(404).end();
			}
		}
		catch(e) {
			console.log(e);
			res.status(404).end();
		}
	},

	getSubtitles : function(req, res) {
		try {
			var params = decodeURI(req.params[0]);
		    // var file = path.join(config.harddisk, params.replace(/\/$/, '/index.html'));
		    var file = path.join(config.harddisk, config.trailersPath, params, params);
		    file = decodeURI(file);
		    file += config.subtitleExtensions.webvtt;
		    console.log('file', file);
		    var hd = path.join(config.harddisk);
		    if (file.indexOf(hd + path.sep) !== 0) {
		        return res.status(403).end('Forbidden');
		    }
		    var type = config.mime[path.extname(file).slice(1)] || 'text/plain';
		    var s = fs.createReadStream(file);
		    s.on('open', function () {
		        res.set('Content-Type', type);
		        s.pipe(res);
		    });
		    s.on('error', function () {
		        res.set('Content-Type', 'text/plain');
		        res.status(404).end('Not found');
		    });
		}
		catch(e) {
			console.log(e);
			res.status(404).end();
		}
	}
}

module.exports = directory;