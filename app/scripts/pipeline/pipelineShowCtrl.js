angular.module('rxPipelineApp')
    .controller('PipelineShowCtrl', function ($scope, $routeParams, $location, Pipeline, PipelineRun) {
        Pipeline.get({id: $routeParams.id}, function (data) {
            $scope.pipeline = data;
        }, function (error) {
            console.info(error);
            //TODO implement Flash Msg here
            alert('Error fetching Pipeline');
            $location.path('/home');
        });

        $scope.runs = PipelineRun.list();

        $scope.deleteRun = function(runId) {
            PipelineRun.remove({id: runId},
                function (data) {
                    $scope.pipeline = data;
                }, function (error) {
                    console.log(error);
                    //TODO: Figure out error flow here
                });
        };
    });