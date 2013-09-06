'use strict';

var Q = require('q'), User = require('./../../server/db/schemas').User, 
	rest = require('restler');

exports.findByUsername = function (username) {
	var defer = Q.defer();

	User.findOne({ username: username }, function (err, user) {
		if (err) return defer.reject(err);

		return (user) ? defer.resolve(user) : defer.reject({ msg: 'No user found'});
	});

	return defer.promise;
};

exports.authGithub = function (user, password, done) {
    rest.get('https://api.github.com', { username: user.username, password:password })
        .on('success', function (data, response) {
            return done(null, user );
        }).on('fail', function (data, response) {
            return done(null, false, { msg: 'Invalid Credentials'});
        }).on('error', function(data, response) {
        	return done(null, false, { msg: 'Invalid Credentials'});
        });
};

exports.isAuthenticated = function (req, res, next) {
    return req.isAuthenticated() ? next() : res.json(401, { msg: "Unauthorized Request"});
};

exports.logout = function (req, res) {
    req.logout();
    res.json(200, { msg: "Logged Out"});
};

exports.authSuccess = function (req, res) {
    res.json(200, req.user);
};

exports.loggedIn = function (req, res) {
    return (req.isAuthenticated()) ? exports.authSuccess(req, res) : res.json(401, {loggedIn: false});
};

exports.serialize = function (user, done) {
    done(null, user._id);
};

exports.deserialize = function(user, done) {
    done(null, user);
};