'use strict';
var Build = require('./../../server/db/schemas').Build;

exports.list = function (req, res) {
    var fields = 'name description created createBy lastUpdated lastUpdatedBy commands'
    return Build.find({}, fields, function (err, builds) {
        return (err) ? res.json(400, {msg: 'Unable to fetch builds'}) : res.json(200, builds);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    
    return Build.findOne({_id:id}, function (err, build) {
        return (err || !build) ? res.json(404, {msg: "Unable to find build with id: " + id}) : res.json(200, build);
    });
};

exports.save = function (req, res) {
    var myBuild = new Build(req.body);
    
    return myBuild.save( function (err, build) {
        return (!err) ? res.json(200, build) : res.json(400, {msg: "Unable to create new build"});
    });
};

exports.update = function (req, res) {
    var id = req.params.id;
    var body = req.body;
    body.lastUpdated = new Date();
    
    return Build.update({_id: id}, body, {}, function (err, updatedNumber, raw) {
        console.log(err);
        return (!err) ?  res.json(200, raw) : res.json(400, {msg: "Unable to update build id: " + id });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    
    return Build.remove({ _id: id}, function (err) {
        return (!err) ? res.json(200, {msg: "Deleted build id: " + id}) : res.json(400, {msg: "Unable to delete build id: " + id});
    });
};
