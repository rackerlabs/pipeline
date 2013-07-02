'use strict';
var Pipeline = require('./../../server/db/schemas').Pipeline;

exports.list = function (req, res) {
    return Pipeline.find(function (err, pipelines) {
        return (err) ? res.json(400, {msg: 'Unable to fetch pipelines'}) : res.json(200, pipelines);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    
    return Pipeline.findOne(function (err, pipeline) {
        return (err || !pipeline) ? res.json(404, {msg: "Unable to find pipeline with id: " + id}) : res.json(200, pipeline);
    });
};

exports.save = function (req, res) {
    var myPipeline = new Pipeline(req.body);
    
    return myPipeline.save(function (err, pipeline) {
        return (!err) ? res.json(200, pipeline) : res.json(400, {msg: "Unable to create new pipeline"});
    });
};

exports.update = function (req, res) {
    var id = req.params.id, 
        body = req.body;
    body.lastUpdated = new Date();
    
    return Pipeline.update({_id: id}, body, {}, function (err, updatedNumber, raw) {
        return (!err) ?  res.json(200, raw) : res.json(400, {msg: "Unable to update pipeline id: " + id });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    
    return Pipeline.remove({_id: id}, function (err) {
        return (!err) ? res.json(200, {msg: "Deleted pipeline id: " + id}) : res.json(400, {msg: "Unable to delete pipeline id: " + id});
    });
};