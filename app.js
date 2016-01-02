
"use strict"


var insertKey = "ttang·blog";
var http = require("http");
var fs = require("fs");
var url = require('url');

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var Blog = require('./Blog.js');

var index = fs.readFileSync('index.html');
index = "";

global._ObjectID = ObjectID;
global._db = "";
global._dataBase = "ttang";

var mongoUrl = 'mongodb://localhost:27017/ttang';
// Connect using MongoClient
MongoClient.connect(mongoUrl, function(err, db) {
  	
  	if(err){
		console.log("mongoClient open err", err)
		return
	}
	_db = db;
    if (!module.parent) {
		http.createServer(app).listen(8000);
		console.log('listening on port 8000', new Date());
	}
});


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
		let record = new Date + ` -- ${clientIp} -- ${clientUa} \n`
		// console.log(record)
		fs.appendFile('log', record, function (err) {
			if (err) throw err;
		});
		if (index) {
			res.end(index);
		}else {
			fs.readFile('index.html', function (err, data) {
				console.log("should not goes there");
			  	if (err) throw err;
				res.end(data);
			});	
		}
		return;
	};

	let idReg = /\/blog\/\S{24}$/;
	if (path === "/blogs") {
		Blog.findTitles(function (err, docs) {
			res.end(JSON.stringify(docs));	
		})
	}else if ( idReg.test(path) ) {
		let id = path.replace("/blog/", "");
		let blogId = new _ObjectID(id);
		let blog = new Blog(blogId);

		blog.find(function () {
			res.end(JSON.stringify(blog))
		});

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
	}else if (path === "/insert"){
		parseBody(req, function (err, body) {
			if (err) throw err;
			let title = body.title;
			let content = body.content;
			let key = body.key;

			if (key === insertKey) {
				let blog = new Blog(null, title, content, null);
				blog.save(function () {
					res.end('{"ok":"ok"}');
				})
			}else {
				res.writeHead(500);
				res.end('{"err":"err"}');		
			}
		})
	}else {
		res.writeHead(500);
		res.end('{"err":"err"}');
	}
}


function parseBody(req, callback){
    let body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let data = null;
        try {
            data = JSON.parse(body);
        } catch (er) {
        	callback(er)
        	return
        }
        callback(null, data);
    });
}
