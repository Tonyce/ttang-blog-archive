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
		collection.find({}, {"title": 1}).toArray(function(err, docs){
	        assert.equal(null, err);
	        callback(null, docs);
		});
	}

	// Find some documents
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
}


module.exports = Blog;