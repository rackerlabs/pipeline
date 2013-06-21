'use strict';
var spawn = require('child_process').spawn;
var Build = require('./../../server/db/schemas').Build; //TODO: Save data to mongodb

module.exports = function( socket ) {

    socket.on( 'send:example', function( data ) {
        console.log("begining send:example");

        var find = spawn('find', ['.', '-name', '*.js']);

        find.stdout.on('data', function(data) {
            socket.emit('send:example', data.toString() );
        });

        find.stderr.on('data', function(data) {
            console.log("Error occurred: " + data);

            socket.emit('send:example', data.toString());
        });

        find.on('close', function(code) {
            socket.emit('send:example', "find ended with exit code: " + code );
        });
    });
};