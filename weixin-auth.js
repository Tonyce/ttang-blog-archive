
'use strict';

const https = require('https');
const url = require('url');
const querystring = require('querystring');

const weixinAppId = "wx10ee54e66df3785d";
const weixinAppSecret = "6ab24f181c6d378b5ed9ffb3d0b80507";


class WeixinAuth {

	constructor() {
		this.accessToken = "";
		this.setAccessTokenTime = "";
		this.accessTokenExpire = 0;

		this.jsapiTicket = "";
		this.setJsapiTicketTime = "";
		this.jsapiTicketExpire = 0;

	}

	accessTokenIsValuable() {
		if (this.accessToken && 
			this.accessTokenExpire && 
			( new Date() - this.setAccessTokenTime > (this.accessTokenExpire - 10) * 1000 ) ) {

			return true;
		}
		return false;
	}

	jsapiTicketIsValuable() {
		if (this.jsapiTicket && 
			this.jsapiTicketExpire && 
			( new Date() - this.setJsapiTicketTime > (this.jsapiTicketExpire - 10) * 1000 ) ) {

			return true;
		}
		return false;
	}

	setJsapiTicket (jsapiTicket) {
		var jsapiTicketObj = JSON.parse(jsapiTicket);
		jsapiTicket = jsapiTicketObj.ticket;

		this.jsapiTicket = jsapiTicket;
		this.setJsapiTicketTime = new Date();
		this.jsapiTicketExpire = jsapiTicketObj["expires_in"];
	}

	setAccessToken (accessToken) {
		var accessTokenObj = JSON.parse(accessToken);
		accessToken = accessTokenObj["access_token"];
		this.accessToken = accessToken;
		this.setAccessTokenTime = new Date();
		this.accessTokenExpire = accessTokenObj["expires_in"];
	}

	requestAccessToken() {
		var accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${weixinAppId}&secret=${weixinAppSecret}`;
		return httpsReq(accessTokenUrl, "GET", "", "");
	}

	requestJsapiTicket() {
		var jsapiUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${this.accessToken}&type=jsapi`;
		return httpsReq(jsapiUrl, "GET", "", "");
	}
}

module.exports = WeixinAuth;

function httpsReq (urlStr, method, headers, body) {

	let postData = body ? JSON.stringify(body) : "";
	let passHeaders = {
		'User-Agent': 'Fuck Experience',
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData)
	}

	if (headers) {
		for (let key in headers) {
			passHeaders[key] = headers[key];
		}
	}
	
  	let urlObject = url.parse(urlStr);
    let options = {
        "host": urlObject.host,
        "path": urlObject.path,
        "method": method,
        "headers": passHeaders
    };
	let promise = new Promise( function  (resolve, reject) {    
		    let req = https.request(options, (res) => {
		        let str = '';
		        res.setEncoding('utf8');
		        res.on('data', (chunk) => {
		            str += chunk;
		        });
		        res.on('end', function () {
		        	// console.log("str", str)
		            resolve(str);
		        });
		    });
		    req.on('error', (e) => {
		    	// console.log("e", e)
		    	reject(e);
		    });
		    req.write(postData);
		    req.end();
		}
	);
	return promise;
}
