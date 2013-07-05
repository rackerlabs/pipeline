'use strict';

angular.module( 'rxPipelineApp' )
    .controller( 'MainCtrl', [ '$scope', 'socket', '$location', '$window', 'Pipelines', 'Steps', function( $scope, socket, $location, $window, Pipelines, Steps ) {
        $scope.Pipelines = Pipelines;
        $scope.Steps = Steps;
        
        $scope.connectedClass = 'icon-remove';
        $scope.connected = 'Not Connected to Server';

        socket.on( 'send:onConnect', function( data ) {
            $scope.connected = data.data;
            $scope.connectedClass = 'icon-link';
        } );

        $scope.socketExample = function() {
            console.log('sending event to socket');
            socket.emit( 'builds:startBuild', {
                id: '51c12f137b1b2be326000001'
            } );
        };

        socket.on('builds:update', function( data ) {
            console.log('client socket on');
            console.log("> " + data);
        });

        socket.on('builds:error', function(data) {
            alert('Error occurred: ' + data);
        });

        $scope.redirect = function( path ) {
            console.log('attempting to redirect to ' + path );
//            $location.path( path );
            $window.location.href = path;
        };

    }]);
