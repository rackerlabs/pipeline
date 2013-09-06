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

var BRANCH_SCHEMA = new Schema({
       name: String,
       repoUrl: String,
       type: String
    });

var PIPELINE_SCHEMA = new Schema({
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: Date,
        branches: [BRANCH_SCHEMA],
        steps: [{buildId: String}]
    });


var REPO_SCHEMA = new Schema({
        created: { type: Date, default: Date.now},
        createBy: String,
        lastUpdated: Date,
        owner: String,
        repoName: String,
        apiToken: String
    });

var USER_SCHEMA = new Schema({
        created: { type: Date, default: Date.now },
        createdBy: String,
        lastUpdated: Date,
        username: { type: String, unique: true, required: true },
        lastLogin: Date
    });

exports.Pipeline = mongoose.model('Pipeline', PIPELINE_SCHEMA);
exports.Build = mongoose.model('Build', BUILD_SCHEMA);
exports.Repo = mongoose.model('Repo', REPO_SCHEMA);
exports.User = mongoose.model('User', USER_SCHEMA);