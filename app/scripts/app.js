'use strict';

angular.module( 'rxPipelineApp', ['ngRoute', 'ngResource', 'btford.socket-io',
        'ngSanitize', 'ngCookies'])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            templateUrl: '/views/login/login.html',
            controller: 'LoginCtrl'
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
