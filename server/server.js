'use strict';

var express     = require('express'),
    cons        = require('consolidate'),
    http        = require('http'),
    path        = require('path'),
    mongoose    = require('mongoose'),
    appConfig   = require('../app-config.json'),
    db          = appConfig.database,
    pipeline    = require('./routes/pipeline'),
    task       = require('./routes/task'),
    repo        = require('./routes/repo'),
    github      = require('./routes/github'),
    vm          = require('./routes/vm'),
    user        = require('./routes/user'),
    passport    = require('passport'),
    Strategy    = require('passport-local').Strategy,
    auth        = require('./routes/auth'),
    notify       = require('./routes/notify');

var port = process.env.PORT || appConfig.server.port;
var server = exports.server = express();

var authenticate = function(username, password, done) {
    auth.findByUsername(username).then(function (user) {
        return auth.authGithub(user, password, done);
    }).catch( function(error) {
        return done(null, false, error);
    });
};

passport.use( new Strategy (authenticate));
passport.serializeUser( auth.serialize );
passport.deserializeUser( auth.deserialize );

// Configure Server
server.configure( function() {
    server.set( 'port', port );
    server.set( 'views', path.join( __dirname, './../app' ) );
    server.engine( 'html', cons.hogan );
    server.set( 'view engine', 'html' );
    server.use( express.cookieParser());
    server.use( express.bodyParser() );
    server.use( express.methodOverride() );
    
    server.use( express.session( { secret: appConfig.secret }) );
    server.use( passport.initialize() );
    server.use( passport.session() );
    server.use( express.static( path.join( __dirname, './../app' ) ) );
    server.use( server.router );
} );

server.configure( 'development', function() {
    user.bootstrap();
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
server.get('/api/pipelines', pipeline.list);
server.get('/api/pipelines/:id', pipeline.get);
server.post('/api/pipelines', pipeline.save);
server.put('/api/pipelines/:id', pipeline.update);
server.delete('/api/pipelines/:id', pipeline.delete);

server.get('/api/pipelines/:id/vm', vm.get);
server.post('/api/pipelines/:id/vm', vm.create);
server.delete('/api/pipelines/:id/vm', vm.delete);
server.post('/api/pipelines/:id/reboot', vm.reboot);

server.get('/api/vm', vm.list);

server.get('/api/tasks', task.list);
server.get('/api/tasks/:id', task.get);
server.post('/api/tasks', task.save);
server.put('/api/tasks/:id', task.update);
server.delete('/api/tasks/:id', task.delete);

server.get('/api/repo', repo.list);
server.get('/api/repo/:id', repo.get);
server.post('/api/repo', repo.save);
server.put('/api/repo/:id', repo.update);
server.delete('/api/repo/:id', repo.delete);

server.get('/api/user', user.list);
server.get('/api/user/:id', user.list);
server.post('/api/user', user.save);
server.put('/api/user/:id', user.update);
server.delete('/api/user/:id', user.delete);

server.get('/api/github/pulls/:repoId', github.listPulls);
server.post('/api/github/pulls/:repoId', github.createPull);
server.get('/api/github/pulls/:repoId/mergeable/:pullId', github.isPullMergeable);
server.post('/api/github/pulls/:repoId/merge/:pullId', github.mergePull);
server.get('/api/github/branches/:repoId', github.listBranches);
server.post('/api/github/branches/:repoId', github.createBranch);
server.post('/api/github/tags/:repoId', github.createTag);
server.post('/api/notify/email/:id', notify.emailUser);
server.post('/api/notify/emails', notify.emailUsers);

server.post('/api/auth', passport.authenticate('local'), auth.authSuccess);
server.delete('/api/auth', auth.logout);
server.get('/api/auth/loggedIn', auth.loggedIn);

//This is here to route all the HTML5 routes to the index.html
server.get('*', function(req, res){
    res.sendfile('app/index.html');
});

console.log('Connecting to DB - mongodb://' + db.host + '/' + db.name);
mongoose.connect('mongodb://' + db.host + '/' + db.name);