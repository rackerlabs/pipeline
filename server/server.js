'use strict';

/**
 * Module dependencies
 */

var express     = require('express'),
    cons        = require('consolidate'),
    http        = require('http'),
    path        = require('path'),
    mongoose    = require('mongoose'),
    appConfig   = require('../app-config.json'),
    db          = appConfig.database,
    pipeline    = require('./routes/pipeline'),
    build       = require('./routes/build'),
    repo        = require('./routes/repo'),
    github      = require('./routes/github');

// Server instance
var server = exports.server = express();

// Configure Server
server.configure( function() {
    server.set( 'port', process.env.PORT || appConfig.server.port );
    server.set( 'views', path.join( __dirname, './../app' ) );
    server.engine( 'html', cons.hogan );
    server.set( 'view engine', 'html' );
    server.engine( 'hjs', cons.hogan );
    server.set( 'view engine', 'hjs' );

    server.use( express.bodyParser() );
    server.use( express.methodOverride() );
    server.use( express.static( path.join( __dirname, './../app' ) ) );
    server.use( server.router );
} );

server.configure( 'development', function() {
    server.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
} );

server.configure( 'production', function() {
    server.use( express.errorHandler() );
} );


// Start server - hook in sockets instance
var io = require('socket.io').listen( http.createServer( server ).listen( server.get( 'port' ), function() {
    console.log( 'Express server listening on ' + server.get( 'port' ) );
} ) );

io.sockets.on( 'connection', function( socket ) {

    socket.emit( 'send:onConnect', {
        data: 'Sockets Connected'
    } );

    // Example socket
    // @todo remove the requirement to pass in the socket
    require( './sockets/buildSocket' )( socket );

} );

// Configure Routes
server.get('/api/pipeline', pipeline.list);
server.get('/api/pipeline/:id', pipeline.get);
server.post('/api/pipeline', pipeline.save);
server.put('/api/pipeline/:id', pipeline.update);
server.delete('/api/pipeline/:id', pipeline.delete);
server.get('/api/build', build.list);
server.get('/api/build/:id', build.get);
server.post('/api/build', build.save);
server.put('/api/build/:id', build.update);
server.delete('/api/build/:id', build.delete);
server.get('/api/repo', repo.list);
server.get('/api/repo/:id', repo.get);
server.post('/api/repo', repo.save);
server.put('/api/repo/:id', repo.update);
server.delete('/api/repo/:id', repo.delete);

server.get('/api/github/pulls/:repoId', github.listPulls);
server.post('/api/github/pulls/:repoId', github.createPull);
server.get('/api/github/pulls/:repoId/mergeable/:pullId', github.isPullMergeable);
server.post('/api/github/pulls/:repoId/merge/:pullId', github.mergePull);
server.get('/api/github/branches/:repoId', github.listBranches);
server.post('/api/github/branches/:repoId', github.createBranch);


console.log('Connecting to DB - mongodb://' + db.host + '/' + db.name);
mongoose.connect('mongodb://' + db.host + '/' + db.name);