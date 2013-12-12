'use strict';

var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var NOTIFICATION_SCHEMA = new Schema({
    notificationType: { type: String },
    contacts: { type: Array, required: true },
    subject: { type: String, required: false },
    body: { type: String, required: true },
    onSuccess: { type: Boolean, 'default': false },
    onFailure: { type: Boolean, 'default': false }
});

var BRANCH_SCHEMA = new Schema({
        name: String,
        repoUrl: String,
        type: String
    });

var TASK_COMMAND_SCHEMA = new Schema({
        command: String,
        stopBuildOnFailure: { type: Boolean, 'default': true }
    });

var TASK_RUN_SCHEMA = new Schema({
        output: String,
        startTime: { type: Date, 'default': Date.now },
        endTime: { type: Date },
        isSuccessful: { type: Boolean, 'default': true }
    });

var TASK_SCHEMA = new Schema({
        name: { type: String, unique: true, required: true },
        description: String,
        created: { type: Date, 'default': Date.now },
        createBy: String,
        lastUpdated: { type: Date, 'default': Date.now },
        lastUpdatedBy: String,
        taskRuns: [{taskRunId: String}],
        commands: [TASK_COMMAND_SCHEMA],
        notifications: [NOTIFICATION_SCHEMA]
    });

var PIPELINE_RUN_SCHEMA = new Schema({
        created: { type: Date, 'default': Date.now},
        createBy: String,
        lastUpdated: Date,
        taskRuns: [{taskRunId: String}]
    });

var PIPELINE_SCHEMA = new Schema({
        name: { type: String, required: true, unique: false },
        created: { type: Date, 'default': Date.now},
        createBy: String,
        lastUpdated: Date,
        branches: [BRANCH_SCHEMA],
        tasks: [TASK_SCHEMA],
        pipelineRuns: [PIPELINE_RUN_SCHEMA],
        notifications: [NOTIFICATION_SCHEMA]
    });

var VM_SCHEMA = new Schema({
        created: { type: Date, 'default': Date.now },
        instanceId: String,
        ipAddress: { type: String, 'default': '' },
        pipelineId: String
    });

var REPO_SCHEMA = new Schema({
        created: { type: Date, 'default': Date.now},
        createBy: String,
        lastUpdated: Date,
        owner: { type: String, required: true },
        repoName: { type: String, required: true },
        apiToken: { type: String, required: true }
    });

var USER_SCHEMA = new Schema({
        created: { type: Date, 'default': Date.now },
        createdBy: String,
        lastUpdated: { type: Date, 'default': Date.now },
        username: { type: String, unique: true, required: true },
        email : { type: String, unique:true, required: true },
        lastLogin: Date
    });

exports.Pipeline = mongoose.model('Pipeline', PIPELINE_SCHEMA);
exports.PipelineRun = mongoose.model('PipelineRun', PIPELINE_RUN_SCHEMA);
exports.Task = mongoose.model('Task', TASK_SCHEMA);
exports.TaskRun = mongoose.model('TaskRun', TASK_RUN_SCHEMA);

exports.Vm = mongoose.model('Vm', VM_SCHEMA);
exports.Repo = mongoose.model('Repo', REPO_SCHEMA);
exports.User = mongoose.model('User', USER_SCHEMA);
