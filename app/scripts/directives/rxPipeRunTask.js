angular.module('rxPipelineApp')
    .directive('rxPipeRunTask', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/directives/rx-pipe-run-task.html',
            scope : {
                name: '=',
                lastEndDate: '=',
                lastStartDate: '=',
                lastRunBy: '=',
                status: '='
            }
        };
    });