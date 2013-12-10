'use strict';

angular.module( 'rxPipelineApp' )
    .controller( 'MainCtrl', [ '$scope', 'socket', '$location', '$window', '$cookies', '$routeParams', 'Pipelines', 'Steps', 'Auth', 'Builds', function( $scope, Socket, $location, $window, $cookies, $routeParams, Pipelines, Steps, Auth, Builds ) {
//         $scope.Pipelines = Pipelines;
//         $scope.Steps = Steps;
//         $scope.Builds = Builds;
//         $scope.routeParams = $routeParams;
        
//         $scope.connectedClass = 'icon-remove';
//         $scope.connected = 'Not Connected to Server';

//         $scope.Socket = Socket;

//         Socket.on( 'send:onConnect', function( data ) {
//             $scope.connected = data.data;
//             $scope.connectedClass = 'icon-link';
//         } );

//         $scope.socketExample = function() {
//             console.log('sending event to socket');
//             Socket.startBuild('51d72b420bf9b10000000002');
//         };

//         Socket.on('builds:error', function(data) {
//             alert('Error occurred: ' + data);
//         });

//         $scope.redirect = function( path ) {
//             console.log('attempting to redirect to ' + path );
// //            $location.path( path );
//             $window.location.href = path;
//         };

//         $scope.Auth = Auth;
    }]);
