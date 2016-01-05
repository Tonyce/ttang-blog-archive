"use strict";

var assert = require('assert');

const blogCollection = "blog"

class Blog {
	
	constructor(_id, title, content, category) {
		this._id = _id; //
		this.title = title;
		this.content = content;
		this.category = category;
		this.time = new Date();
	}

	static findTitles (callback) {
		let collection = _db.collection(blogCollection);	
		collection.find({}, {"title": 1}).sort({"time": -1}).toArray(function(err, docs){
	        assert.equal(null, err);
	        callback(null, docs);
		});
	}

	find (callback) {
		if ((this._id instanceof _ObjectID) === false) {
			callback({err: "this._id is illeagel"})
			return;
		}
		let collection = _db.collection(blogCollection);	
		collection.findOne({_id: this._id}, (err, doc) => {
	        assert.equal(null, err);
	        assert.notEqual(null, doc);
	        this.title = doc.title;
	        this.content = doc.content;
	        this.category = doc.category;
	        this.time = doc.time;
	        this.comments = doc.comments;
	        callback()
		});
	}

	save (callback) {
		let collection = _db.collection(blogCollection);
		collection.insertOne(this, (err, result) => {
			assert.equal(err, null);
			assert.equal(1, result.insertedCount);
			this._id = result.insertedId;
	        callback()
	    });
	}

	insertComment (comment, ip, callback) {
		let collection = _db.collection(blogCollection);

		if (!comment) {
			callback({"err":"不接受空的"});
			return;
		};

		// check ip time;
		let time = new Date();
		let compareTime = new Date().addDates(-1);

		this.findComment(ip, compareTime, (err, comments) => {
			
			if (err || comments) {
				callback({"err":"限制时间段内（24小时内一次）不能提交"});
				return
			}
			let commentBody = {
				"ip": ip,
				"comment": comment,
				"time": time
			}

			collection.update({_id: this._id}, {$push: {"comments": commentBody}}, (err, result) => {
				assert.equal(err, null);
		        callback(null, {"time": time});
		    });
		});
	}

	findComment(ip, compareTime, callback) {
		let collection = _db.collection(blogCollection);
		let query = {
			"_id": this._id, 	
			"comments": { 
				"$elemMatch": { 
					"ip": ip, 
					"time": { $gt: compareTime } 
				}
			} 
		}

		collection.findOne(query, (err, doc) => {
			callback(err, doc && doc.comments)
		});
	}
}

Date.prototype.addDates= function(d){
    this.setDate(this.getDate() + d);
    return this;
}

module.exports = Blog;