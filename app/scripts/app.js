'use strict';

angular.module( 'rxPipelineApp', [ 'ui.bootstrap', 'btford.socket-io', 'ngSanitize', 'pipelineDirectives', 'pipelineServices', 'pipelineFilters'])
    .config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
        $routeProvider
        .when( '/', {
            // @todo fix this
            templateUrl: 'scripts/main/mainView.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
    }]);
