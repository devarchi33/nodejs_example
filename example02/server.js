var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

http.createServer(function(request, response) {
	if(request.url === '/favicon.ico') {
		response.writeHead(404);
		response.end();
		return;
	}

	var lookup = path.basename(decodeURI(request.url)) || 'index.html', f = 'content/' + lookup;

	fs.exists(f, function(exists){
		console.log(exists ? lookup + " is there" : lookup + " doesn't exists");
		if(exists){

			//async file call.
			fs.readFile(f, function(err, data){
				if(err){
					response.writeHead(500);
					response.end('Server Error!');
					return;
				}

				var headers = {'Content-type' : mimeTypes[path.extname(lookup)]};
				response.writeHead(200, headers);
				response.end(data);
			});

			return;
		}

		response.writeHead(404);
		response.end('Page Not Found!');
	});
}).listen(8080);