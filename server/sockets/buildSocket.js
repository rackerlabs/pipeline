'use strict';
var spawn = require('child_process').spawn;
var Q = require('q');
var Build = require('./../../server/db/schemas').Build; //TODO: Save data to mongodb
var _ = require('lodash');

module.exports = function( socket ) {
    var scope = {};
    
    scope.seqSpawn = function( cmd ) {
        return function () {
            var defer = Q.defer();
            var words = cmd.command.split(' ');
    
            console.log("Started: xxxxxxx " + words + " xxxxxxx");
    
            var command = spawn(words.shift(), words);
    
            command.stdout.on('data', function(data) {
                socket.emit('builds:update', data.toString());
            });
    
            command.stderr.on('data', function(data) {
                socket.emit('builds:error', data.toString());
                defer.resolve(data);
            });
    
            command.on('close', function(code) {
                console.log("Finished: xxxxxxx " + words + " xxxxxxx");
                socket.emit('builds:finished', code);
                defer.resolve(code);
            });
    
            return defer.promise;
        }
    };

    socket.on("builds:startBuild", function(data) {
        Build.findById(data.id, function(err, build) {
            if (err || !build) {
                socket.emit('builds:error', 'Unable to find build by id: ' + data.id);
                return;
            };
            
            var funcs = [];

            for (var i = 0; i < build.commands.length; i++) { 
                funcs.push( scope.seqSpawn );
            };

            var result = Q.resolve(0);

            _.forEach(build.commands, function(c) {
                result = result.then( this(c) );
            }, scope.seqSpawn);
        });
    });
};