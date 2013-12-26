angular.module('rxPipelineApp')
    .controller('TaskListCtrl', function ($scope, Task) {
        Task.list( function (tasks) {
            $scope.tasks = tasks;
        }, function () {
            $scope.status = { msg: 'Unable to list tasks', success: false };
        });
    });
