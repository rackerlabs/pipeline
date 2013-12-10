angular.module('rxPipelineApp')
    .controller('PipelineShowCtrl', function ($scope, $routeParams, $location, Pipeline, Task) {
        Pipeline.get({id: $routeParams.id}, function (data) {
            $scope.pipeline = data;
        }, function (error) {
            console.info(error);
            alert('Error fetching Pipeline');
            $location.path('/home');
        });

        $scope.tasks = Task.list();
    });