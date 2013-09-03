'use strict';

angular.module( 'rxPipelineApp', [ 'ui.bootstrap', 'btford.socket-io', 'ngSanitize', 'pipelineDirectives', 'pipelineServices', 'pipelineFilters', 'pipelineAuth'])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            // @todo fix this
            templateUrl: 'scripts/main/mainView.html',
            controller: 'MainCtrl'
        })
        .when( '/login', {
            templateUrl: 'scripts/main/login.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
    }]);
