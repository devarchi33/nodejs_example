var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.html' : 'text/html',
	'.js' : 'text/javascript',
	'.css' : 'text/css'
};

var cache = {};

http.createServer(function (request, response) {
	if(request.url === '/favicon.ico') {
		response.writeHead(404);
		response.end();
		return;
	}

	var lookup = path.basename(decodeURI(request.url)) || 'index.html'; 
	var f = 'content/' + lookup;

	fs.exists(f, function (exists){
		console.log(exists ? lookup + " is there" : lookup + " doesn't exists");
		if(exists){
			var headers = {'Content-type' : mimeTypes[path.extname(lookup)]};
			if(cache[f]){
				response.writeHead(200, headers);
				response.end(data);

				return;
			}

			var s = fs.createReadStream(f).once('open', function () {
				response.writeHead(200, headers);
				try {
					this.pipe(response);
					console.log('here!!!!!');
				} catch (e) {
					console.log(e);
					return false;
				}
			}).once('error', function (e){
				console.log(e);
				response.writeHead(500);
				response.end('Server Error!');
			});

			fs.stat(f, function (err, stats) {
				var bufferOffset = 0;
				cache[f] = {content: new Buffer(stats.size)};
				s.on('data', function (chunk){
					chunk.copy(cache[f].content, bufferOffset);
					bufferOffset += chunk.length;
				});
			});
		}

		response.writeHead(404);
		response.end('Page Not Found!');
	});
}).listen(8080);


























