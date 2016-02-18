'use strict'

const WeixinAuth = require('./weixin-auth')

const weixinAuth = new WeixinAuth()

var handleJSApiTicket = function (jsapiTicket) {
	var jsapiTicketObj = JSON.parse(jsapiTicket);
	jsapiTicket = jsapiTicketObj.ticket;
	console.log(jsapiTicket);	
}

var handleAccessToken = function(accessToken) {
	// console.log(accessToken)
	var accessTokenObj = JSON.parse(accessToken)
	accessToken = accessTokenObj["access_token"]
	weixinAuth.requestJsapiTicket(accessToken)
			.then(handleJSApiTicket)
			.catch(function(err) {
				console.log(err)
			})
}

weixinAuth.requestAccessToken()
		.then(handleAccessToken)
		.catch(function (err) {
			console.log(err)
		})

