var http = require('http');
var path = require('path');

var pages = [
		{route: '/', output: 'Woohoo'},
		{route: '/about/this', output: 'Multi Level routing with Node example!'},
		{route: '/about/node', output: 'Evented I/O for v8 Javascript.'},
		{route: 'another page', output: function() {
			console.log(this.route);
			return 'Here\'s ' + this.route;
		}}
	];

http.createServer(function(request, response) {
	var lookup = decodeURI(request.url);

	pages.forEach(function(page) {
		if(page.route === lookup){
			response.writeHead(200, {'Content-type' : 'text/html'});
			response.end(typeof page.output === 'function' ? page.output() : page.output);
		}
	});

	if(!response.finished) {
		response.writeHead(404);
		response.end('Page Not Found!');
	}
}).listen(8080);