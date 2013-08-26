'use strict';

exports.isAuthenticated = function (req, res, next) {
    return req.isAuthenticated() ? next() : res.json(401, { msg: "Unauthorized Request"});
};

exports.logout = function (req, res) {
    req.logout();
    res.json(200, { msg: "Logged Out"});
};

exports.authSuccess = function (req, res) {
    res.json(200, {'_id': 'myid', firstName: req.body.username, loggedIn: true});
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