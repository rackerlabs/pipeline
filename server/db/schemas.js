'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var BUILD_SCHEMA = new Schema({
        name: String,
        description: String,
        created: { type: Date, default: Date.now },
        createBy: String,
        lastUpdated: { type: Date, default: Date.now },
        lastUpdatedBy: String,
        commands: [],
        history: []
    });

var PIPELINE_SCHEMA = new Schema({
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: Date,
        branches: [{name: String, repoUrl: String}],
        steps: []
    });

exports.Pipeline = mongoose.model('Pipeline', PIPELINE_SCHEMA);
exports.Build = mongoose.model('Build', BUILD_SCHEMA);