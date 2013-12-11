angular.module('rxPipelineApp')
    .controller('PipelineEditCtrl', function ($scope, $routeParams, $location, Pipeline, Task) {
        Pipeline.get({id: $routeParams.id},
            function (pipeline) {
                $scope.pipeline = pipeline;
            }, function (error) {
                console.log(error);
                //TODO: Add flash message here
                $location.path('/home');
            });

        $scope.tasks = Task.list();
    });
