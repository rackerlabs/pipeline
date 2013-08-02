'use strict';
var passport = require('passport');

exports.isAuthenticated = function (req, res, next) {
	return ( req.isAuthenticated() ) ? next() : res.send(401, { msg: "Unauthorized Request"});
};

exports.authenticate = function (accessToken, refreshToken, profile, done) {
	process.nextTick( function () {
		//TODO: Fetch user and validate user exists
		return done(null, profile);	
	});
};

exports.failCallback = function (req, res) {
	res.send(401, { msg: "Unauthorized"} );
};

exports.successCallback = function (req, res) {
	res.send(200, { msg: "Authenticated"} );
}

exports.logout = function (req, res) {
	req.logout();
	res.send(200, { msg: "Logged Out"});
};