'use strict';
var spawn = require('child_process').spawn;
var Q = require('q');
var Build = require('./../../server/db/schemas').Build; //TODO: Save data to mongodb

module.exports = function( socket ) {
    var seqSpawn = function( cmd ) {
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
    };

    socket.on("builds:startBuild", function(data) {
        Build.findById(data.id, function(err, build) {
            if (err || !build) {
                socket.emit('builds:error', 'Unable to find build by id: ' + data.id);
                return;
            };

            var functions = []; 
            for (var i = 0; i < build.commands.length; i++) { 
                functions.push( seqSpawn );
            };

            var result = Q.resolve(0);
            var counter = 0;

            functions.forEach( function(f) {
                result = result.then( f(build.commands[counter]) );
                counter++;
            });
        });
    });
};