
var http = require("http");
var fs = require("fs");

var body = {
	"key":"ttanglovejjing·blog",
	// "key":"ttang·blog",
	// "id":"568b5dbe238396b2579202cf",
	"title":"iOS--view切换效果（Material Design Bubble Animation）",
	"content": fs.readFileSync('./blogs/iOS--view切换效果（Bubble）.md', 'utf8')

}

var postData = JSON.stringify(body);
var options = {
	hostname: '107.150.96.151',
	port: 80,
	// hostname: 'localhost',
	// port: 8000,
	path: '/insert',
	// path: '/update',
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
