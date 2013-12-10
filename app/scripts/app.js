'use strict';

angular.module( 'rxPipelineApp', ['ngRoute', 'ngResource', 'btford.socket-io', 
        'ngSanitize', 'ngCookies', 'pipelineDirectives', 'pipelineServices', 'pipelineFilters', 'pipelineAuth'])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            templateUrl: '/scripts/main/mainView.html',
            controller: 'MainCtrl'
        })
        .when( '/login', {
            templateUrl: '/scripts/main/login.html',
            controller: 'MainCtrl'
        })
        .when( '/settings', {
            templateUrl: '/scripts/main/settings.html',
            controller: 'MainCtrl'
        })
        .when( '/settings/:view', {
            templateUrl: '/scripts/main/settings.html',
            controller: 'MainCtrl'
        })
        .when( '/settings/:view/edit/:id', {
            templateUrl: '/scripts/main/settings.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
    }]);
