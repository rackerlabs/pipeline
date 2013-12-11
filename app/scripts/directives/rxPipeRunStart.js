angular.module('rxPipelineApp')
    .directive('rxPipeRunStart', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/directives/rx-pipe-run-start.html',
            scope: {
                bodyText: '@'
            }
        };
    });