const config = {
	harddisk: "H:/MOVIE/",
	postersPath : "/assets/posters/",
	trailersPath : "/MOVIE/",
	mime : {
	    html: 'text/html',
	    txt: 'text/plain',
	    webvtt: 'text/vtt',
	    css: 'text/css',
	    gif: 'image/gif',
	    jpg: 'image/jpeg',
	    png: 'image/png',
	    svg: 'image/svg+xml',
	    js: 'application/javascript'
	},
	fileExtensions : [".mp4", ".mkv"],
	subtitleExtensions : {
		webvtt: ".webvtt",
		srt: ".srt"
	}
}


module.exports = config;