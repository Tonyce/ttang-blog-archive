
var http = require("http");
var fs = require("fs");

var body = {
	"key":"ttang·blog",
	"title":"Just Do It",
	"content": fs.readFileSync('./blogs/JustDoIt.md', 'utf8')
}

var postData = JSON.stringify(body);
var options = {
	// hostname: '107.150.96.151',
	hostname: 'localhost',
	port: 8000,
	path: '/insert',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData)
	}
};

var req = http.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log('res: ' + chunk);
	});
	res.on('end', function() {
		console.log('No more data in response.')
	})
});

req.on('error', function(e) {
  	console.log('problem with request: ' + e.message);
});

req.write(postData);
req.end();
