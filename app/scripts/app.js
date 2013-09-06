'use strict';

angular.module( 'rxPipelineApp', [ 'ui.bootstrap', 'btford.socket-io', 'ngSanitize', 'ngCookies', 'pipelineDirectives', 'pipelineServices', 'pipelineFilters', 'pipelineAuth'])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            templateUrl: 'scripts/main/mainView.html',
            controller: 'MainCtrl'
        })
        .when( '/login', {
            templateUrl: 'scripts/main/login.html',
            controller: 'MainCtrl'
        })
        .when( '/logout', {
            controller: 'LogoutCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
    }]);
