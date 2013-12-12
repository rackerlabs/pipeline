'use strict';
var Task = require('./../../server/db/schemas').Task;

exports.list = function (req, res) {
    var fields = 'name description created createBy lastUpdated lastUpdatedBy taskRuns commands';
    return Task.find({}, fields, function (err, tasks) {
        return (err) ? res.json(400, {msg: 'Unable to fetch tasks'}) : res.json(200, tasks);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    
    return Task.findOne({_id:id}, function (err, task) {
        return (err || !task) ? res.json(404, {msg: 'Unable to find task with id: ' + id}) : res.json(200, task);
    });
};

exports.save = function (req, res) {
    var myTask = new Task(req.body);
    
    return myTask.save( function (err, task) {
        return (!err) ? res.json(200, task) : res.json(400, {msg: 'Unable to create new task'});
    });
};

exports.update = function (req, res) {
    var id = req.params.id;
    var body = req.body;
    body.lastUpdated = new Date();
    
    return Task.update({_id: id}, body, {}, function (err, updatedNumber, raw) {
        console.log(err);
        return (!err) ?  res.json(200, raw) : res.json(400, {msg: 'Unable to update task id: ' + id });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    
    return Task.remove({ _id: id}, function (err) {
        return err ? res.json(400, {msg: 'Unable to delete task id: ' + id}) :
            res.json(200, {msg: 'Deleted task id: ' + id});
    });
};

var saveTask = function (obj) {
    return new Task(obj).save( function (err, task) {
        console.log('Tasks Error', err);
        return err ? new Error(err) : task;
    });
};

exports.bootstrap = function() {
    saveTask({ name: 'Create VM', createdBy: 'Chris', lastUpdatedBy: 'Chris'});
    saveTask({ name: 'Deploy', createdBy: 'Chris', lastUpdatedBy: 'Chris'});
    saveTask({ name: 'Isolation Complete', createdBy: 'Chris', lastUpdatedBy: 'Chris'});
    saveTask({ name: 'Smoke Testing', createdBy: 'Chris', lastUpdatedBy: 'Chris'});
    saveTask({ name: 'Prod Ready', createdBy: 'Chris', lastUpdatedBy: 'Chris'});
};