
"use strict"

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
	}else {
		res.end('{"err":"err"}');
	}
}
