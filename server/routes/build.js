'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var BUILD_SCHEMA = new Schema({
        name: String,
        commands: [], 
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: { type: Date, default: Date.now},
        lastUpdatedBy: String,
        history: []
    });

var Build = mongoose.model('Build', BUILD_SCHEMA);

exports.list = function (req, res) {
    res.json(200, { msg: 'List of builds'});
};

exports.get = function (req, res) {
    res.json(200, { msg: 'Build by id'});
};

exports.save = function (req, res) {
    res.json(200, { msg: "I saved some SHIT!" });
};

exports.update = function (req, res) {
    res.json(200, {msg: "I updated your mom!" });
};

exports.delete = function (req, res) {
    res.json(200, {msg: "I deleted it!  What of it beeeach??"});
};