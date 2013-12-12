angular.module('rxPipelineApp')
    .controller('HomeCtrl', function ($scope, $window, Pipeline) {
        $scope.pipelines = Pipeline.list();

        $scope.deletePipeline = function (pipelineId) {
            if ( !$window.confirm('Are you sure you want to remove this Pipeline') ) {
                return;
            }

            Pipeline.remove( {id: pipelineId},
                function () {
                    $scope.pipelines = Pipeline.list();
                }, function () {
                    //TODO change this to an alert message
                    alert('Unable to delete pipeline');
                });
        };
    });