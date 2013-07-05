'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var BUILD_COMMAND_SCHEMA = new Schema({
        command: String,
        stopBuildOnFailure: { type: Boolean, default: true } 
    });

var BUILD_HISTORY_SCHEMA = new Schema({
        output: String,
        startTime: { type: Date, default: Date.now },
        endTime: { type: Date },
        isSuccessful: { type: Boolean, default: true }
    });

var BUILD_SCHEMA = new Schema({
        name: String,
        description: String,
        created: { type: Date, default: Date.now },
        createBy: String,
        lastUpdated: { type: Date, default: Date.now },
        lastUpdatedBy: String,
        commands: [BUILD_COMMAND_SCHEMA],
        buildHistory: [BUILD_HISTORY_SCHEMA]
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