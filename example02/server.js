var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.html' : 'text/html',
	'.js' : 'text/javascript',
	'.css' : 'text/css'
};

var cache = {
	store: {},
	maxSize: 26214400, //25MB
	maxAge: 5400 * 1000, //1.5h
	cleanAfter: 7200 * 1000, //2h
	cleanedAt: 0, //동적으로 설정됨.
	clean: function (now) {
		if(now - this.cleanAfter > this.cleanedAt) {
			var that = this;
			Object.keys(this.store).forEach(function (file){
				if(now > this.store[file].timestamp + this.maxAge) {
					delete that.store[file];
				}
			});
		}
	}
};

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
				console.log(stats);
				if(stats.size < cache.maxSize){
					var bufferOffset = 0;
					cache.store[f] = {
						content: new Buffer(stats.size),
						timestamp: Date.now()
					};
					s.on('data', function (data){
						data.copy(cache.store[f].content, bufferOffset);
						bufferOffset += data.length;
						console.log("here data!");
					});
				}
			});
		}

		response.writeHead(404);
		response.end('Page Not Found!');
		cache.clean(Date.now());
	});
}).listen(8080);


























