'use strict';
/*jshint unused:true */

var spawn = require('child_process').spawn;
var Q = require('q');
var Build = require('./../../server/db/schemas').Build; //TODO: Save data to mongodb
var _ = require('lodash');

module.exports = function( socket ) {
    var scope = {};

    scope.seqSpawn = function( build, counter ) {
        return function () {
            var defer = Q.defer(),
                cmd = build.commands[counter],
                history = {};

            var words = cmd.command.split(' ');
            var command = spawn(words.shift(), words);

            command.stdout.on('data', function(data) {
                var dataString = data.toString();
                socket.emit('builds:update', dataString);
                history.output = history.output + dataString;
            });

            command.stderr.on('data', function(data) {
                var dataString = data.toString();
                socket.emit('builds:error', dataString);

                history.output = history.output + dataString;
                history.isSuccessful = false;
            });

            command.on('close', function(code) {
                socket.emit('builds:finished', code);

                history.endTime = new Date();

                build.buildHistory.push(history);
                build.save();

                defer.resolve(code);
            });

            return defer.promise;
        };
    };

    socket.on('builds:startBuild', function (data) {
        Build.findById(data.id, function(err, build) {
            if (err || !build) {
                socket.emit('builds:error', 'Unable to find build by id: ' + data.id);
                return;
            }

            var result = Q.resolve(0);
            var counter = 0;

            _.forEach(build.commands, function(command, counter) {
                result = result.then( this(build, counter) );
                counter++;
            }, scope.seqSpawn);
        });
    });
};