
"use strict"

var http = require("http");
var fs = require("fs");
var url = require('url');

http.createServer(app).listen(8000);

let titles = [
	{"id":"565050484fb15fc935b98404", "title":"需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"},
	{"id":"565050484fb15fc935b98404", "title":"单击“替换”按钮逐个行删除空行，或单击“全部替换”按钮删除全部空行（注意：EditPlus有时存在“全部替换”不能一次性完全删除空行的问题，可能是程序BUG，需要多按几次按钮"}
]

function app (req, res) {
	let reqMethod = req.method;
	let reqUrlObj = url.parse(req.url, true);
	let path = reqUrlObj["pathname"].toLowerCase();
	// let pathList = path.split('/');

	let clientIp =  req.headers['x-forwarded-for'] || 
     				req.connection.remoteAddress || 
     				req.socket.remoteAddress ||
     				req.connection.socket.remoteAddress;
    let clientUa = req.headers['user-agent'];

	if (path === "/") {
		let record = `${clientIp} ${clientUa} \n`
		console.log(record)
		fs.appendFile('log', record, function (err) {
			if (err) throw err;
		});
		fs.readFile('index.html', function (err, data) {
		  	if (err) throw err;
			res.end(data);
		});
		return;
	};

	let idReg = /\/blog\/\S{24}$/
	if (path === "/blogs") {
		res.end(JSON.stringify(titles));
	}else if ( idReg.test(path) ) {
		res.end('{"title":"title", "content":"test", "time":"time"}')
	}else if (path === "/about"){
		fs.readFile('about.md', 'utf-8', function (err, data) {
		  	if (err) throw err;
			res.end(data);
		});
	} else if (path === "/preword"){
		fs.readFile('preword.md', 'utf-8', function (err, data) {
		  	if (err) throw err;
			res.end(data);
		});
	}else {
		res.end('{"err":"err"}');
	}
}
