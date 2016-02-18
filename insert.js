
var http = require("http");
var fs = require("fs");

var body = {
	"key": "ttanglovejjing·blog",
	// "key":"ttang·blog",
	// "id":"568b5dbe238396b2579202cf",
	"title":"又一次离年远去",
	"content": fs.readFileSync('./blogs/又一次离年远去.md', 'utf8')

}

var postData = JSON.stringify(body);
var options = {
	hostname: 'tonyce.top',
	port: 80,
	path: '/ttblog/insert',
	// hostname: 'localhost',
	// port: 8000,
	// path: '/insert',
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
