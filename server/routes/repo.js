'use strict';
var Repo = require('./../../server/db/schemas').Repo;

exports.list = function (req, res) {
    return Repo.find(function (err, repos) {
        return (err) ? res.json(400, {msg: 'Unable to fetch repos'}) : res.json(200, repos);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    
    return Repo.findOne(function (err, repo) {
        return (err || !repo) ? res.json(404, {msg: "Unable to find repo with id: " + id}) : res.json(200, repo);
    });
};

exports.save = function (req, res) {
    var myRepo = new Repo(req.body);
    
    return myRepo.save(function (err, repo) {
        return (!err) ? res.json(200, repo) : res.json(400, {msg: "Unable to create new repo"});
    });
};

exports.update = function (req, res) {
    var id = req.params.id, 
        body = req.body;
    body.lastUpdated = new Date();
    
    return Repo.update({_id: id}, body, {}, function (err, updatedNumber, raw) {
        return (!err) ?  res.json(200, raw) : res.json(400, {msg: "Unable to update repo id: " + id });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    
    return Repo.remove({_id: id}, function (err) {
        return (!err) ? res.json(200, {msg: "Deleted repo id: " + id}) : res.json(400, {msg: "Unable to delete repo id: " + id});
    });
};