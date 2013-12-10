'use strict';

var Q = require('q'), User = require('./../../server/db/schemas').User,
    rest = require('restler');

exports.findByUsername = function (username) {
    var defer = Q.defer();

    User.findOne({ username: username }, function (err, user) {
        if (err) { defer.reject(err); }

        return (user) ? defer.resolve(user) : defer.reject({ msg: 'No user found'});
    });

    return defer.promise;
};

exports.authGithub = function (user, password, done) {
    rest.get('https://api.github.com', { username: user.username, password:password })
        .on('success', function () {
            return done(null, user );
        }).on('fail', function () {
            return done(null, false, { msg: 'Invalid Credentials'});
        }).on('error', function() {
            return done(null, false, { msg: 'Invalid Credentials'});
        });
};

exports.logout = function (req, res) {
    req.logout();
    res.json(200, { msg: 'Logged Out'});
};

exports.authSuccess = function (req, res) {
    console.log(req);
    res.json(200);
};

exports.loggedIn = function (req, res) {
    console.log(req.isAuthenticated());
    return (req.isAuthenticated()) ? res.json(200, { user: req.user }) : res.json(401, {loggedIn: false});
};

exports.serialize = function (user, done) {
    console.log('Serializing', user._id);
    done(null, user._id);
};

exports.deserialize = function(id, done) {
    console.log(id);
    User.findById(id, function (err, user) {
        console.log('Deserializing', user);
        done(err, user);
    });
};