'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var PIPELINE_SCHEMA = new Schema({
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: Date,
        branches: [{name: String, repoUrl: String}],
        steps: []
    });

var Pipeline = mongoose.model('Pipeline', PIPELINE_SCHEMA);

exports.list = function(req, res) {
    res.json(200, { msg: 'List of pipelines'});
};

exports.get = function(req, res) {
    res.json(200, { msg: 'Pipeline by id'});
};

exports.save = function(req, res) {
    res.json(200, { msg: "I saved some SHIT!" } );
};

exports.update = function(req, res) {
    res.json(200, {msg: "I updated your mom!" });
};

exports.delete = function(req, res) {
    res.json(200, {msg:"I deleted it!  What of it beeeach??"});
}