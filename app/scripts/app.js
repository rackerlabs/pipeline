'use strict';

angular.module( 'rxPipelineApp', ['ngRoute', 'ngResource', 'btford.socket-io', 'http-auth-interceptor',
    'rxAuthSvc' ])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            templateUrl: '/views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/home', {
            templateUrl: '/views/home/home.html',
            controller: 'HomeCtrl'
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
    }]).run( function ($rootScope, $location) {

        $rootScope.$on('event:auth-loginRequired', function () {
            if ( !$rootScope.authenticated ) {
                $rootScope.storedLocation = $location.path();
                $location.path('/');
            }
        });

        $rootScope.$on('event:auth-loginConfirmed', function () {
            var path = $rootScope.storedLocation ? $rootScope.storedLocation : '/login';
            $location.path(path);
            $rootScope.authenticated = true;
        });
    });