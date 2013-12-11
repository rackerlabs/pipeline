'use strict';

var User = require('./../../server/db/schemas').User, Q = require('q');

exports.findById = function (id) {
	var defer = Q.defer();

	User.findById(id, function (err, user) {
		(err) ? defer.reject(err) : defer.resolve(user);
	});

	return defer.promise;
};

exports.findUsersByIds = function (ids) {
	var defer = Q.defer();

	User.find({_id: { $in: ids } }, function (err, users) {
		(err) ? defer.reject(err) : defer.resolve(users);
	});

	return defer.promise;
};

exports.list = function (req, res) {
    return User.find({}, function (err, users) {
        return (err) ? res.json(400, {msg: 'Unable to fetch users'}) : res.json(200, users);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    
    return User.findOne({_id:id}, function (err, user) {
        return (err || !user) ? res.json(404, {msg: "Unable to find user with id: " + id}) : res.json(200, user);
    });
};

exports.save = function (req, res) {
    var myUser = new User(req.body);
    
    return myUser.save( function (err, user) {
        return (!err) ? res.json(200, user) : res.json(400, {msg: "Unable to create new user"});
    });    
};

exports.update = function (req, res) {
    var id = req.params.id;
    var body = req.body;
    body.lastUpdated = new Date();
    
    return User.update({_id: id}, body, {}, function (err, updatedNumber, raw) {
        return (!err) ?  res.json(200, raw) : res.json(400, {msg: "Unable to update user id: " + id });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    
    return User.remove({ _id: id}, function (err) {
        return (!err) ? res.json(200, {msg: "Deleted user id: " + id}) : res.json(400, {msg: "Unable to delete user id: " + id});
    });
};

var saveUser = function(user) {
	return new User(user).save( function(err, user) {
		return err ? new Error(err) : null;
	});
};

exports.bootstrap = function () { 
	saveUser( { createdBy: "christophercantu", username: "christophercantu", email: 'chris.cantu@rackspace.com'} );
	saveUser( { createdBy: "christophercantu", username: "nickburns2006",  email: 'stephen.golub@rackspace.com' });
	saveUser( { createdBy: "christophercantu", username: "rnreekez", email: 'roger.enriquez@rackspace.com'});
	saveUser( { createdBy: "christophercantu", username: "hussamd", email: 'hussam.dawood@rackspace.com'});
    saveUser( { createdBy: "christophercantu", username: "rsyed83", email: 'rahman.syed@rackspace.com'} );
}