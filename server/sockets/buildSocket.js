'use strict';
var spawn = require('child_process').spawn;
var Q = require('q');
var Build = require('./../../server/db/schemas').Build; //TODO: Save data to mongodb

module.exports = function( socket ) {
    var seqSpawn = function(words) {
        var defer = Q.defer();

        var command = spawn(words.shift(), words);

        command.stdout.on('data', function(data) {
            socket.emit('builds:update', data.toString());
        });

        command.stderr.on('data', function(data) {
            socket.emit('builds:error', data.toString());
        });

        command.on('close', function(code) {
            socket.emit('builds:finished', code);
            defer.resolve(code);
        });

        return defer.promise;
    }    

    socket.on( 'send:example', function( data ) {
        console.log("begining send:example");

        var find = spawn('find', ['.', '-name', '*.js']);

        find.stdout.on('data', function(data) {
            socket.emit('send:example', data.toString() );
        });

        find.stderr.on('data', function(data) {
            socket.emit('send:example', data.toString());
        });

        find.on('close', function(code) {
            socket.emit('send:example', "find ended with exit code: " + code );
        });
    });

    socket.on("builds:startBuild", function(data) {
        Build.findById(data.id, function(err, build) {
            if (err || !build) {
                socket.emit('builds:error', 'Unable to find build by id: ' + data.id);
                return;
            };

            var functions = []
            //TODO Ensure commands are executed in order.  
            for (var i = 0; i < build.commands.length; i++) {
                var words = build.commands[i].command.split(' ');
                functions.push( seqSpawn(words) );
            };

            functions.reduce(function( sofar, f) {
                return sofar.then(f);
            }, Q.resolve(0));

        });

    });
};